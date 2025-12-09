import os
import psycopg2
from dotenv import load_dotenv

# Load environs from parent directory (backend/)
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(backend_dir, '.env'))

DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')

def reset_db():
    print(f"Connecting to {DB_NAME} as {DB_USER}...")
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Dropping public schema...")
        cur.execute("DROP SCHEMA public CASCADE;")
        print("Recreating public schema...")
        cur.execute("CREATE SCHEMA public;")
        
        cur.close()
        conn.close()
        print("Database reset successfully.")
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == "__main__":
    reset_db()
