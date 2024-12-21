
# Database Migration Strategies

## # # Migration Paths

## 1. SQLite to Production Databases

## # # # ### SQLite to PostgreSQL

```text
text
text
text
python

## # # # migrate_sqlite_to_postgres.py

from sqlalchemy import create_engine
import sqlite3
import psycopg2
import pandas as pd

def migrate_tables():

## # # # Source SQLite connection

```text
text

```text
    sqlite_conn = sqlite3.connect('dev.db')

```text

```text
text

## # # Target PostgreSQL connection

```text
text

```text
    pg_conn = psycopg2.connect(

```text

```text
text

```text
text

```text
        dbname="proddb",

```text

```text
text

```text
text

```text
        user="produser",

```text

```text
text

```text
text

```text
        password="prodpass",

```text

```text
text

```text
text

```text
        host="prodhost"

```text

```text
text

```text
text

```text
    )

```text

```text
text

## # # Get all tables

```text
text

```text
    tables = pd.read_sql_query(

```text

```text
text

```text
text

```text
        "SELECT name FROM sqlite_master WHERE type='table'",

```text

```text
text

```text
text

```text
        sqlite_conn

```text

```text
text

```text
text

```text
    )

```text

```text
text

```text
text

```text
    for table in tables['name']:

```text

```text
text

## # # Read data from SQLite

```text
text

```text
        df = pd.read_sql_query(f"SELECT * FROM {table}", sqlite_conn)

```text

```text
text

## # # Write to PostgreSQL

```text
text

```text
        df.to_sql(

```text

```text
text

```text
text

```text
            table,

```text

```text
text

```text
text

```text
            create_engine('postgresql://produser:prodpass@prodhost/proddb'),

```text

```text
text

```text
text

```text
            if_exists='replace',

```text

```text
text

```text
text

```text
            index=False

```text

```text
text

```text
text

```text
        )

```text

```text
text

```text
text
text
text
text

## # # # ### SQLite to MySQL

```text
text
text
text
python

## # # # migrate_sqlite_to_mysql.py

from sqlalchemy import create_engine
import sqlite3
import mysql.connector
import pandas as pd

def migrate_tables():

## # # # Source SQLite connection

```text
text

```text
    sqlite_conn = sqlite3.connect('dev.db')

```text

```text
text

## # # Target MySQL connection

```text
text

```text
    mysql_conn = mysql.connector.connect(

```text

```text
text

```text
text

```text
        host="prodhost",

```text

```text
text

```text
text

```text
        user="produser",

```text

```text
text

```text
text

```text
        password="prodpass",

```text

```text
text

```text
text

```text
        database="proddb"

```text

```text
text

```text
text

```text
    )

```text

```text
text

## # # Get all tables

```text
text

```text
    tables = pd.read_sql_query(

```text

```text
text

```text
text

```text
        "SELECT name FROM sqlite_master WHERE type='table'",

```text

```text
text

```text
text

```text
        sqlite_conn

```text

```text
text

```text
text

```text
    )

```text

```text
text

```text
text

```text
    for table in tables['name']:

```text

```text
text

```text
text

```text
        df = pd.read_sql_query(f"SELECT * FROM {table}", sqlite_conn)

```text

```text
text

```text
text

```text
        df.to_sql(

```text

```text
text

```text
text

```text
            table,

```text

```text
text

```text
text

```text
            create_engine('mysql://produser:prodpass@prodhost/proddb'),

```text

```text
text

```text
text

```text
            if_exists='replace',

```text

```text
text

```text
text

```text
            index=False

```text

```text
text

```text
text

```text
        )

```text

```text
text

```text
text
text
text
text

## 1. PostgreSQL Migrations

## # # # ### PostgreSQL Version Upgrade

```text
text
text
text
bash

## # !/bin/bash

## # postgres_upgrade.sh

OLD_VERSION="14"
NEW_VERSION="15"

## # # # Stop PostgreSQL services

systemctl stop postgresql-${OLD_VERSION}
systemctl stop postgresql-${NEW_VERSION}

## # # # Initialize new database cluster

/usr/pgsql-${NEW_VERSION}/bin/postgresql-${NEW_VERSION}-setup initdb

## # # # Upgrade database

/usr/pgsql-${NEW_VERSION}/bin/pg_upgrade \
  --old-datadir="/var/lib/pgsql/${OLD_VERSION}/data" \
  --new-datadir="/var/lib/pgsql/${NEW_VERSION}/data" \
  --old-bindir="/usr/pgsql-${OLD_VERSION}/bin" \
  --new-bindir="/usr/pgsql-${NEW_VERSION}/bin" \
  --check

```text
text
text
text
text

## # # # ### Cross-Server Migration

```text
text
text
text
bash

## # !/bin/bash

## # postgres_cross_server.sh

## # Variables

SRC_HOST="source-host"
SRC_DB="sourcedb"
SRC_USER="sourceuser"
DEST_HOST="dest-host"
DEST_DB="destdb"
DEST_USER="destuser"

## # # # Create schema-only backup

pg_dump -h ${SRC_HOST} -U ${SRC_USER} -d ${SRC_DB} --schema-only > schema.sql

## # # # Create data-only backup

pg_dump -h ${SRC_HOST} -U ${SRC_USER} -d ${SRC_DB} --data-only > data.sql

## # # # Apply schema to new database

psql -h ${DEST_HOST} -U ${DEST_USER} -d ${DEST_DB} < schema.sql

## # # # Apply data to new database

psql -h ${DEST_HOST} -U ${DEST_USER} -d ${DEST_DB} < data.sql

```text
text
text
text
text

## 1. MySQL Migrations

## # # # ### MySQL to PostgreSQL with Schema Conversion

```text
text
text
text
python

## # # # mysql_to_postgres.py

import pymysql
import psycopg2
from sqlalchemy import create_engine
import pandas as pd

def convert_schema():

## # # # MySQL connection

```text
text

```text
    mysql_conn = pymysql.connect(

```text

```text
text

```text
text

```text
        host='mysql-host',

```text

```text
text

```text
text

```text
        user='mysql-user',

```text

```text
text

```text
text

```text
        password='mysql-pass',

```text

```text
text

```text
text

```text
        db='mysql-db'

```text

```text
text

```text
text

```text
    )

```text

```text
text

## # # PostgreSQL connection

```text
text

```text
    pg_conn = psycopg2.connect(

```text

```text
text

```text
text

```text
        dbname="pg-db",

```text

```text
text

```text
text

```text
        user="pg-user",

```text

```text
text

```text
text

```text
        password="pg-pass",

```text

```text
text

```text
text

```text
        host="pg-host"

```text

```text
text

```text
text

```text
    )

```text

```text
text

## # # Get MySQL schema

```text
text

```text
    mysql_cursor = mysql_conn.cursor()

```text

```text
text

```text
text

```text
    mysql_cursor.execute("SHOW TABLES")

```text

```text
text

```text
text

```text
    tables = mysql_cursor.fetchall()

```text

```text
text

```text
text

```text
    for table in tables:

```text

```text
text

```text
text

```text
        table_name = table[0]

```text

```text
text

## # # Get create table statement

```text
text

```text
        mysql_cursor.execute(f"SHOW CREATE TABLE {table_name}")

```text

```text
text

```text
text

```text
        create_stmt = mysql_cursor.fetchone()[1]

```text

```text
text

## # # Convert MySQL to PostgreSQL syntax

```text
text

```text
        pg_create_stmt = convert_to_postgres_syntax(create_stmt)

```text

```text
text

## # # Create table in PostgreSQL

```text
text

```text
        pg_cursor = pg_conn.cursor()

```text

```text
text

```text
text

```text
        pg_cursor.execute(pg_create_stmt)

```text

```text
text

```text
text

```text
        pg_conn.commit()

```text

```text
text

```text
text
text
text
text

## 1. MongoDB to SQL Migrations

## # # # ### MongoDB to PostgreSQL

```text
text
text
text
python

## # # # mongo_to_postgres.py

from pymongo import MongoClient
import psycopg2
import json
from sqlalchemy import create_engine
import pandas as pd

def flatten_document(doc, parent_key='', sep='_'):

```text
text

```text
    items = []

```text

```text
text

```text
text

```text
    for k, v in doc.items():

```text

```text
text

```text
text

```text
        new_key = f"{parent_key}{sep}{k}" if parent_key else k

```text

```text
text

```text
text

```text
        if isinstance(v, dict):

```text

```text
text

```text
text

```text
            items.extend(flatten_document(v, new_key, sep=sep).items())

```text

```text
text

```text
text

```text
        else:

```text

```text
text

```text
text

```text
            items.append((new_key, v))

```text

```text
text

```text
text

```text
    return dict(items)

```text

```text
text
def migrate_collection(collection_name):

## # # # MongoDB connection

```text
text

```text
    mongo_client = MongoClient('mongodb://mongo-host:27017/')

```text

```text
text

```text
text

```text
    mongo_db = mongo_client['source-db']

```text

```text
text

## # # PostgreSQL connection

```text
text

```text
    pg_engine = create_engine('postgresql://user:pass@pg-host/target-db')

```text

```text
text

## # # Get MongoDB collection

```text
text

```text
    collection = mongo_db[collection_name]

```text

```text
text

## # # Flatten and convert documents

```text
text

```text
    flat_docs = [flatten_document(doc) for doc in collection.find()]

```text

```text
text

## # # Convert to DataFrame and save to PostgreSQL

```text
text

```text
    df = pd.DataFrame(flat_docs)

```text

```text
text

```text
text

```text
    df.to_sql(collection_name, pg_engine, if_exists='replace', index=False)

```text

```text
text

```text
text
text
text
text

## # # # # Migration Verification Tools

## 1. Data Integrity Checker

```text
text
text
text
python

## # # # verify_migration.py

def verify_data_integrity(source_conn, target_conn, table_name):

## # # # Check row counts

```text
text

```text
    src_count = pd.read_sql(f"SELECT COUNT(*) FROM {table_name}", source_conn)

```text

```text
text

```text
text

```text
    tgt_count = pd.read_sql(f"SELECT COUNT(*) FROM {table_name}", target_conn)

```text

```text
text

```text
text

```text
    if src_count.iloc[0,0] != tgt_count.iloc[0,0]:

```text

```text
text

```text
text

```text
        raise ValueError(f"Row count mismatch in {table_name}")

```text

```text
text

## # # Check data checksums

```text
text

```text
    src_checksum = pd.read_sql(f"SELECT MD5(CAST((SELECT * FROM {table_name} FOR UPDATE) AS text))", source_conn)

```text

```text
text

```text
text

```text
    tgt_checksum = pd.read_sql(f"SELECT MD5(CAST((SELECT * FROM {table_name} FOR UPDATE) AS text))", target_conn)

```text

```text
text

```text
text

```text
    if src_checksum.iloc[0,0] != tgt_checksum.iloc[0,0]:

```text

```text
text

```text
text

```text
        raise ValueError(f"Data checksum mismatch in {table_name}")

```text

```text
text

```text
text
text
text
text

## 1. Performance Comparison

```text
text
text
text
python

## # # # compare_performance.py

def compare_query_performance(source_conn, target_conn, test_queries):

```text
text

```text
    results = []

```text

```text
text

```text
text

```text
    for query in test_queries:

```text

```text
text

## # # Test source database

```text
text

```text
        start_time = time.time()

```text

```text
text

```text
text

```text
        pd.read_sql(query, source_conn)

```text

```text
text

```text
text

```text
        source_time = time.time()

```text

```text
text
  -$2start_time

## # # # Test target database

```text
text

```text
        start_time = time.time()

```text

```text
text

```text
text

```text
        pd.read_sql(query, target_conn)

```text

```text
text

```text
text

```text
        target_time = time.time()

```text

```text
text
  -$2start_time

```text
text

```text
        results.append({

```text

```text
text

```text
text

```text
            'query': query,

```text

```text
text

```text
text

```text
            'source_time': source_time,

```text

```text
text

```text
text

```text
            'target_time': target_time,

```text

```text
text

```text
text

```text
            'difference': abs(source_time

```text

```text
text
  -$2target_time)

```text
text

```text
        })

```text

```text
text

```text
text

```text
    return pd.DataFrame(results)

```text

```text
text

```text
text
text
text
text

## # # # # Rollback Strategies

## 1. Point-in-Time Recovery

```text
text
text
text
bash

## # !/bin/bash

## # rollback_to_point.sh

TIMESTAMP="2024-01-01 00:00:00"

## # # # PostgreSQL

pg_restore --target-timestamp="${TIMESTAMP}" -d dbname backup.dump

## # # # MySQL

mysqlbinlog --stop-datetime="${TIMESTAMP}" binlog.* | mysql -u user -p dbname

```text
text
text
text
text

## 1. Full Database Rollback

```text
text
text
text
bash

## # !/bin/bash

## # full_rollback.sh

## # Create backup of current state

pg_dump dbname > pre_rollback_backup.sql

## # # # Restore previous version

pg_restore -d dbname previous_backup.dump

## # # # Verify restoration

psql -d dbname -c "SELECT COUNT(*) FROM critical_table;"

```text
text
text
text
text
