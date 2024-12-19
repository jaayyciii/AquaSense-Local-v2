from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import asyncpg

URL_DATABASE = 'postgresql://postgres:1234@localhost:5432/postgres'

Engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Engine)

Base = declarative_base()
Base.metadata.create_all(bind=Engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_conn():
    conn = await asyncpg.connect(URL_DATABASE)
    try:
        yield conn
    finally:
        await conn.close()