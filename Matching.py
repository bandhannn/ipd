# # from sqlalchemy import create_engine, text
# # from sqlalchemy.orm import sessionmaker

# # # Setup database connection
# # DATABASE_URL = "postgresql://postgres:Akshay2407@@localhost:5000/postgres"  # Replace with your actual details
# # engine = create_engine(DATABASE_URL)
# # Session = sessionmaker(bind=engine)
# # session = Session()

# # # Query the latest signed-in user based on the 'created_at' timestamp
# # latest_user_data = session.execute(text("""
# #     SELECT username, primary_domain, rating
# #     FROM users
# #     ORDER BY created_at DESC
# #     LIMIT 1
# # """)).fetchone()

# # # Extract the primary domain and rating for the latest signed-in user
# # username, primary_domain, rating = latest_user_data

# # # Query for users with the same primary domain and rating
# # similar_users = session.execute(text("""
# #     SELECT username
# #     FROM users
# #     WHERE primary_domain = :domain AND rating = :rating
# # """), {'domain': primary_domain, 'rating': rating}).fetchall()

# # # Extract usernames from the query result
# # usernames = [user[0] for user in similar_users]

# # # Print or return the list of similar users' usernames
# # print(usernames)





# # #"postgresql://postgres:Akshay2407@@localhost:5432/postgres"

# import psycopg2

# # Database connection details
# DB_NAME = "postgres"
# DB_USER = "postgres"
# DB_PASSWORD = ""  # Replace with your actual password
# DB_HOST = "localhost"
# DB_PORT = "5432"  # Default PostgreSQL port

# try:
#     # Establish a connection
#     conn = psycopg2.connect(
#         dbname=DB_NAME,
#         user=DB_USER,
#         password=DB_PASSWORD,
#         host=DB_HOST,
#         port=DB_PORT
#     )
#     print("Connected to the database successfully!")

#     # Create a cursor
#     cur = conn.cursor()

#     # Query the latest signed-in user
#     cur.execute("""
#         SELECT username, primary_domain, rating
#         FROM users
#         ORDER BY created_at DESC
#         LIMIT 1;
#     """)
    
#     latest_user = cur.fetchone()

#     if latest_user:
#         username, primary_domain, rating = latest_user
#         print(f"Latest user: {username}, Domain: {primary_domain}, Rating: {rating}")

#         # Query for similar users
#         cur.execute("""
#             SELECT username
#             FROM users
#             WHERE primary_domain = %s AND rating = %s;
#         """, (primary_domain, rating))

#         similar_users = cur.fetchall()
#         usernames = [user[0] for user in similar_users]

#         print("Users with the same primary domain and rating:", usernames)
#     else:
#         print("No users found in the database.")

#     # Close cursor and connection
#     cur.close()
#     conn.close()
#     print("Database connection closed.")

# except psycopg2.Error as e:
#     print("Error connecting to the database:", e)

import psycopg2
import uuid  # To generate unique group IDs

# Database connection details
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "Akshay2407@"  # Replace with your actual password
DB_HOST = "localhost"
DB_PORT = "5432"

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

