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
from langchain_openai import ChatOpenAI

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
        
        # Update prompt template to emphasize hadith grades
        self.prompt_template = """You are a knowledgeable Islamic chatbot that provides accurate information from both the Quran and Hadith. 

        Previous conversation:
        {chat_history}

        Guidelines:
        1. Use ONLY the provided context to answer questions
        2. For Quranic verses:
           - Include both Arabic and English translations
           - Cite as (Quran Surah:Ayah)
        3. For Hadiths:
           - ALWAYS start hadith citations with its grade in brackets [e.g., (Grade: Sahih)]
           - Include both Arabic and English translations
           - Cite as (Grade: [grade], Collection Name, Hadith Number)
           - Only use hadiths graded as Sahih (authentic) or Hasan (good)
           - If hadith grade is unclear or weak, mention this and prefer other references
        4. For general questions:
           - Prioritize Sahih (authentic) hadiths when multiple are available
           - Provide evidence from both Quran and Hadith when available
        5. If asked for "more references":
           - Look at the previous conversation to identify the topic
           - Provide different references than previously shown
        6. Be respectful and maintain Islamic etiquette in responses
        7. For verses mentioning Allah, add "Subhanahu wa Ta'ala (Glory be to Him)"
        8. For mentions of Prophet Muhammad, add "ﷺ (peace be upon him)"

        Context: {context}
        
        Current Question: {question}
        
        Answer: """
        
    def fetch_all_hadiths(self, collection: str, api_key: str, max_retries: int, retry_delay: int) -> List[str]:
        """Helper function to fetch all hadiths from a collection with pagination"""
        documents = []
        page = 1
        per_page = 25  # Default pagination value per API docs
        
        while True:
            for attempt in range(max_retries):
                try:
                    print(f"Processing {collection} - Page {page}...")
                    
                    # Construct API URL with parameters
                    params = {
                        'apiKey': api_key,
                        'book': collection,
                        'status': 'sahih,hasan',  # Only fetch authentic hadiths
                        'paginate': per_page,
                        'page': page
                    }
                    
                    response = requests.get(
                        "https://www.hadithapi.com/public/api/hadiths",
                        params=params,
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Debug the response structure
                        print(f"Response status: {data.get('status', 'N/A')}")
                        print(f"Response message: {data.get('message', 'N/A')}")
                        
                        # Get hadiths from the response
                        hadiths = data.get('hadiths', [])
                        
                        if not hadiths:
                            print(f"No more hadiths found for {collection}")
                            return documents
                        
                        for hadith in hadiths:
                            # Extract hadith details
                            hadith_number = hadith.get('hadithNumber', 'N/A')
                            chapter = hadith.get('chapter', 'N/A')
                            status = hadith.get('status', '').lower()
                            arabic = hadith.get('hadithArabic', '')
                            english = hadith.get('hadithEnglish', '')
                            
                            # Format the hadith text
                            text = (
                                f"Hadith: {collection}\n"
                                f"Grade: {status.upper()}\n"
                                f"Number: {hadith_number}\n"
                                f"Chapter: {chapter}\n"
                                f"Arabic: {arabic}\n"
                                f"English: {english}"
                            )
                            documents.append(text)
                            print(f"Added {collection} hadith #{hadith_number}")
                        
                        # Move to next page
                        page += 1
                        # Add delay between pages
                        time.sleep(1)
                        break
                        
                    elif response.status_code == 401:
                        print("Error: Invalid API key")
                        return documents
                    elif response.status_code == 403:
                        print("Error: API key required")
                        return documents
                    elif response.status_code == 404:
                        print(f"Error: Book {collection} not found")
                        return documents
                    else:
                        print(f"Error: Unexpected status code {response.status_code}")
                        print("Response:", response.text)
                        if attempt < max_retries - 1:
                            time.sleep(retry_delay)
                            continue
                        return documents
                        
                except Exception as e:
                    print(f"Error processing {collection} page {page}:")
                    print(f"Exception type: {type(e)}")
                    print(f"Exception message: {str(e)}")
                    if attempt < max_retries - 1:
                        time.sleep(retry_delay)
                        continue
                    return documents

    def load_data(self) -> None:
        """Load and process both Quran and Hadith data from APIs"""
        documents = []
        max_retries = 3
        retry_delay = 2
        
        try:
            # 1. Fetch Quran data (keeping existing code)
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
            
            # 2. Fetch Hadith data
            print("\nFetching Hadith data...")
            hadith_api_key = os.getenv('HADITH_API_KEY')
            if not hadith_api_key:
                print("Error: HADITH_API_KEY not found in environment variables")
                return
            
            # Using correct book slugs from API documentation
            collections = ['sahih-bukhari', 'sahih-muslim']
            for collection in collections:
                print(f"\nFetching complete {collection} collection...")
                
                params = {
                    'apiKey': hadith_api_key,
                    'bookSlug': collection,  # Changed to bookSlug based on API response
                    'status': 'sahih,hasan'  # Only fetch authentic hadiths
                }
                
                response = requests.get(
                    "https://www.hadithapi.com/api/hadiths",
                    params=params,
                    timeout=10
                )
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if isinstance(data, str):
                            data = json.loads(data)
                        
                        # Debug the parsed data structure
                        print("Data keys:", data.keys() if isinstance(data, dict) else "Not a dict")
                        
                        # Get hadiths from the response
                        hadiths = data.get('data', [])  # The hadiths are in the 'data' field
                        
                        if not hadiths:
                            print(f"No hadiths found for {collection}")
                            continue
                        
                        for hadith in hadiths:
                            # Extract all relevant details from the hadith
                            hadith_number = hadith.get('hadithNumber', 'N/A')
                            volume = hadith.get('volume', 'N/A')
                            status = hadith.get('status', '').lower()
                            
                            # Get chapter information
                            chapter = hadith.get('chapter', {})
                            chapter_number = chapter.get('chapterNumber', 'N/A')
                            chapter_english = chapter.get('chapterEnglish', 'N/A')
                            chapter_arabic = chapter.get('chapterArabic', 'N/A')
                            
                            # Get narration details
                            english_narrator = hadith.get('englishNarrator', '')
                            arabic = hadith.get('hadithArabic', '')
                            english = hadith.get('hadithEnglish', '')
                            
                            # Get heading information
                            heading_english = hadith.get('headingEnglish', '')
                            heading_arabic = hadith.get('headingArabic', '')
                            
                            # Format the hadith text with all available information
                            text = (
                                f"Hadith: {collection}\n"
                                f"Grade: {status.upper()}\n"
                                f"Book: Volume {volume}, Number {hadith_number}\n"
                                f"Chapter: {chapter_number} - {chapter_english}\n"
                                f"Chapter (Arabic): {chapter_arabic}\n"
                                f"Heading: {heading_english}\n"
                                f"Heading (Arabic): {heading_arabic}\n"
                                f"Narrator: {english_narrator}\n"
                                f"Arabic: {arabic}\n"
                                f"English: {english}"
                            )
                            documents.append(text)
                            print(f"Added {collection} hadith #{hadith_number}")
                        
                        print(f"Completed {collection}: {len(hadiths)} hadiths fetched")
                    
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON: {e}")
                        print("Response content:", response.text)
                        continue
                    
                elif response.status_code == 401:
                    print("Error: Invalid API key")
                    continue
                elif response.status_code == 403:
                    print("Error: API key required")
                    continue
                elif response.status_code == 404:
                    print(f"Error: Collection {collection} not found")
                    continue
                else:
                    print(f"Error: Unexpected status code {response.status_code}")
                    print("Response:", response.text)
                    continue
            
            print(f"\nTotal documents processed: {len(documents)}")
            
            # Create vector store (keeping existing code)
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
        
        # Create the QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(
                search_kwargs={"k": 10}
            ),
            chain_type_kwargs={
                "prompt": prompt
            }  # Removed memory_key
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