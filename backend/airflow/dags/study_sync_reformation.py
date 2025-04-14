import psycopg2
import uuid  # To generate unique group IDs
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
 
# Database connection details (Use Docker container name for PostgreSQL)
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "Akshay2407@"
DB_HOST = "postgres"  # Use container name instead of localhost
DB_PORT = "5432"
 
def reassign_groups():
    try:
        # Establish a database connection
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        print("Connected to the database successfully!")
        cur = conn.cursor()
 
        # Fetch all user ratings and domains
        cur.execute("SELECT username, primary_domain, rating FROM users;")
        users = cur.fetchall()
 
        for username, primary_domain, rating in users:
            # Determine the correct threshold based on rating (round down to nearest 200)
            new_threshold = (rating // 200) * 200  
 
            # Check if a group exists for this domain & threshold
            cur.execute("""
                SELECT group_id FROM groups WHERE primary_domain = %s AND %s <= (SELECT MIN(rating) FROM users WHERE group_id = groups.group_id);
            """, (primary_domain, new_threshold))
            existing_group = cur.fetchone()
 
            if existing_group:
                group_id = existing_group[0]  # Use existing group
            else:
                group_id = str(uuid.uuid4())  # Create a new group
                cur.execute("""
                    INSERT INTO groups (group_id, primary_domain) VALUES (%s, %s);
                """, (group_id, primary_domain))
                print(f"Created new group {group_id} for {primary_domain} at rating {new_threshold}")
 
            # Update user to new group
            cur.execute("""
                UPDATE users SET group_id = %s WHERE username = %s;
            """, (group_id, username))
 
            print(f"User {username} moved to group {group_id} (Threshold: {new_threshold})")
 
        # Commit changes and close connection
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