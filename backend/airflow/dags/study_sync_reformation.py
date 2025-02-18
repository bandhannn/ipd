import psycopg2
import uuid  # To generate unique group IDs
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

# Database connection details
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "Akshay2407@"  # Replace with your actual password
DB_HOST = "localhost"
DB_PORT = "5432"

def reassign_groups():
    try:
        # Establish a connection
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        print("Connected to the database successfully!")

        cur = conn.cursor()

        # Fetch all users grouped by primary domain
        cur.execute("""
            SELECT primary_domain, array_agg(username) 
            FROM users 
            GROUP BY primary_domain;
        """)

        groups = cur.fetchall()

        for primary_domain, users in groups:
            # Generate a unique group ID
            group_id = str(uuid.uuid4())

            # Insert the new group into a 'groups' table
            cur.execute("""
                INSERT INTO groups (group_id, primary_domain) 
                VALUES (%s, %s) 
                ON CONFLICT (primary_domain) DO NOTHING;
            """, (group_id, primary_domain))

            # Update users with their group ID
            cur.execute("""
                UPDATE users 
                SET group_id = %s 
                WHERE primary_domain = %s;
            """, (group_id, primary_domain))

            print(f"Group created: {group_id} for {primary_domain} with users {users}")

        # Commit changes
        conn.commit()
        cur.close()
        conn.close()
        print("Database connection closed.")

    except psycopg2.Error as e:
        print("Error connecting to the database:", e)

# Define Airflow DAG
default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

dag = DAG(
    "study_sync_reformation",
    default_args=default_args,
    description="Weekly group reformation for StudySync",
    schedule_interval="0 0 * * 0",  # Runs every Sunday at midnight
    catchup=False,
)

task = PythonOperator(
    task_id="reassign_groups",
    python_callable=reassign_groups,
    dag=dag,
)
