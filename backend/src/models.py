from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Association tables for many-to-many relationships
verse_topics = Table('verse_topics', Base.metadata,
    Column('verse_id', Integer, ForeignKey('verses.id')),
    Column('topic_id', Integer, ForeignKey('topics.id'))
)

hadith_topics = Table('hadith_topics', Base.metadata,
    Column('hadith_id', Integer, ForeignKey('hadiths.id')),
    Column('topic_id', Integer, ForeignKey('topics.id'))
)

hadith_narrators = Table('hadith_narrators', Base.metadata,
    Column('hadith_id', Integer, ForeignKey('hadiths.id')),
    Column('narrator_id', Integer, ForeignKey('narrators.id'))
)

class Surah(Base):
    __tablename__ = 'surahs'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    name_arabic = Column(String)
    is_makki = Column(Boolean)
    verses_count = Column(Integer)
    
    verses = relationship("Verse", back_populates="surah")

class Verse(Base):
    __tablename__ = 'verses'
    
    id = Column(Integer, primary_key=True)
    surah_id = Column(Integer, ForeignKey('surahs.id'))
    verse_number = Column(Integer)
    arabic = Column(String)
    english = Column(String)
    embedding = Column(ARRAY(Float), nullable=True)  # Make it nullable
    
    surah = relationship("Surah", back_populates="verses")
    topics = relationship("Topic", secondary="verse_topics")

    def to_dict(self):
        return {
            "id": self.id,
            "surah_number": self.surah.id,
            "verse_number": self.verse_number,
            "arabic": self.arabic,
            "english": self.english,
            "surah_name": self.surah.name
        }

class HadithCollection(Base):
    __tablename__ = 'hadith_collections'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    name_arabic = Column(String)
    
    hadiths = relationship("Hadith", back_populates="collection")

class Hadith(Base):
    __tablename__ = 'hadiths'
    
    id = Column(Integer, primary_key=True)
    collection_id = Column(Integer, ForeignKey('hadith_collections.id'))
    hadith_number = Column(Integer)
    chapter_number = Column(Integer)
    arabic = Column(String)
    english = Column(String)
    grading = Column(String)
    
    collection = relationship("HadithCollection", back_populates="hadiths")
    narrators = relationship("Narrator", secondary=hadith_narrators)
    topics = relationship("Topic", secondary=hadith_topics)

class Narrator(Base):
    __tablename__ = 'narrators'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    name_arabic = Column(String)
    
    hadiths = relationship("Hadith", secondary=hadith_narrators)

class Topic(Base):
    __tablename__ = 'topics'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    name_arabic = Column(String)
    
    verses = relationship("Verse", secondary="verse_topics")
    hadiths = relationship("Hadith", secondary=hadith_topics) 