import os
from typing import List, Dict, Optional
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import json
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

class IslamicChatbot:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = None
        self.qa_chain = None
        
        # Initialize the text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # Add conversation history
        self.conversation_history = []
        self.max_history = 5  # Keep last 5 exchanges
        
        # Update prompt template to include conversation history
        self.prompt_template = """You are a knowledgeable Islamic chatbot that provides accurate information from the Quran. 

        Previous conversation:
        {chat_history}

        Guidelines:
        1. Use ONLY the provided context to answer questions
        2. For specific verse requests (e.g., "show me verses about patience"):
           - Provide up to 5 relevant verses
           - Include both Arabic and English translations
           - Include clear citations (Surah:Ayah)
        3. For general questions:
           - Provide a clear answer with relevant verses as evidence
        4. If asked for "more verses" about a topic:
           - Look at the previous conversation to identify the topic
           - Provide different verses than previously shown
        5. Be respectful and maintain Islamic etiquette in responses
        6. For verses mentioning Allah, add "Subhanahu wa Ta'ala (Glory be to Him)"
        7. For verses mentioning Prophet Muhammad, add "ﷺ (peace be upon him)"

        Context: {context}
        
        Current Question: {question}
        
        Answer: """
        
    def load_data(self) -> None:
        """Load and process Quran data from API with retries"""
        documents = []
        max_retries = 3
        retry_delay = 2  # seconds
        
        try:
            print("\nFetching Quran data...")
            total_surahs = 114
            
            for surah in range(1, total_surahs + 1):
                for attempt in range(max_retries):
                    try:
                        print(f"Processing Surah {surah}/114...")
                        response = requests.get(
                            f"http://api.alquran.cloud/v1/surah/{surah}/editions/quran-uthmani,en.asad",
                            timeout=10
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            for ayah_idx, ayah in enumerate(data['data'][0]['ayahs'], 1):
                                arabic_text = ayah['text']
                                english_text = data['data'][1]['ayahs'][ayah_idx-1]['text']
                                text = (
                                    f"Quran {surah}:{ayah_idx}\n"
                                    f"Arabic: {arabic_text}\n"
                                    f"English: {english_text}"
                                )
                                documents.append(text)
                            break  # Success, move to next surah
                        else:
                            print(f"Error fetching Surah {surah}: Status code {response.status_code}")
                            if attempt < max_retries - 1:
                                time.sleep(retry_delay)
                                continue
                            
                    except requests.exceptions.RequestException as e:
                        print(f"Network error processing Surah {surah}: {str(e)}")
                        if attempt < max_retries - 1:
                            time.sleep(retry_delay)
                            continue
                        
            print(f"\nSuccessfully processed {len(documents)} Quran verses!")
            
            # Create vector store with error handling
            try:
                print("\nCreating vector embeddings...")
                texts = self.text_splitter.create_documents(documents)
                self.vector_store = Chroma.from_documents(
                    documents=texts,
                    embedding=self.embeddings,
                    persist_directory="./data/chroma_db"
                )
                print("Vector store created successfully!")
                
            except Exception as e:
                print(f"Error creating vector store: {str(e)}")
                raise
            
        except Exception as e:
            print(f"Error processing data: {str(e)}")
            raise

    def setup_qa_chain(self) -> None:
        """Initialize the QA chain with custom prompt"""
        prompt = PromptTemplate(
            template=self.prompt_template,
            input_variables=["context", "question", "chat_history"]
        )
        
        # Initialize ChatOpenAI with GPT-3.5-turbo
        llm = ChatOpenAI(
            temperature=0.2,
            model_name="gpt-3.5-turbo"
        )
        
        # Create the QA chain with conversation history
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(
                search_kwargs={"k": 10}
            ),
            chain_type_kwargs={
                "prompt": prompt,
                "memory_key": "chat_history"
            }
        )
        
    def answer_question(self, question: str) -> Dict[str, str]:
        """Process a user question and return an answer with references"""
        if not self.qa_chain:
            return {
                "error": "QA chain not initialized. Please call setup_qa_chain() first.",
                "status": "error"
            }
            
        try:
            # Add basic input validation
            if not question.strip():
                return {
                    "error": "Please provide a valid question.",
                    "status": "error"
                }
            
            # Format conversation history
            chat_history = "\n".join([
                f"Q: {q}\nA: {a}" for q, a in self.conversation_history
            ])
            
            # Run the query with conversation history
            response = self.qa_chain.run({
                "question": question,
                "chat_history": chat_history
            })
            
            # Basic response validation
            if not response or len(response.strip()) < 10:
                return {
                    "error": "Generated response was invalid or too short.",
                    "status": "error"
                }
            
            # Update conversation history
            self.conversation_history.append((question, response))
            if len(self.conversation_history) > self.max_history:
                self.conversation_history.pop(0)  # Remove oldest exchange
            
            return {
                "answer": response,
                "status": "success"
            }
            
        except Exception as e:
            return {
                "error": f"An error occurred: {str(e)}",
                "status": "error"
            }

def main():
    chatbot = IslamicChatbot()
    try:
        chatbot.load_data()
        chatbot.setup_qa_chain()
        print("Islamic chatbot initialized successfully!")
        
        # Simple CLI interface for testing
        while True:
            question = input("\nAsk a question (or type 'quit' to exit): ")
            if question.lower() == 'quit':
                break
                
            response = chatbot.answer_question(question)
            if response.get("status") == "success":
                print("\nAnswer:", response["answer"])
            else:
                print("\nError:", response.get("error"))
                
    except Exception as e:
        print(f"Error initializing chatbot: {str(e)}")

def test_quran_api():
    # Test fetching Surah Al-Fatiha (Chapter 1)
    url = "http://api.alquran.cloud/v1/surah/1/editions/quran-uthmani,en.asad"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print("\nSuccessfully fetched Surah Al-Fatiha!")
            
            # Print first ayah as example
            arabic = data['data'][0]['ayahs'][0]['text']  # Arabic text
            english = data['data'][1]['ayahs'][0]['text'] # English translation
            
            print("\nFirst Verse:")
            print(f"Arabic: {arabic}")
            print(f"English: {english}")
        else:
            print(f"Error: Status code {response.status_code}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()    