import json
from idlelib import Debugger

import pymongo

from pymongo import MongoClient
import csv
import time
import os
import argparse
import sys


def questions_from_file(filepath):
    # Getting questions from csv
    with open(filepath, 'rt') as file:
        data = json.load(file)
        return data


def insert_to_collection(collenctin_name, questionnaire):
    client = MongoClient('localhost', 27017)
    db = client['modamedicDB']
    collection = db[collenctin_name]
    collection.insert(questionnaire)


def upload_periodic_questionnaire():
    file_path = 'EQ5D.json'
    questions = questions_from_file(file_path)
    file_path2 = 'EQ5DVas.json'
    questions2 = questions_from_file(file_path2)
    if len(questions) > 0:
        #dropCollection("Questionnaire")
        insert_to_collection("Questionnaire", questions)
    if len(questions2) > 0:
        #dropCollection("Questionnaire")
        insert_to_collection("Questionnaire", questions2)


def upload_daily_questionnaire():
    file_path = 'DailyQuestionnaire.json'
    questions = questions_from_file(file_path)
    if len(questions) > 0:
        #dropCollection("Questionnaire")
        insert_to_collection("Questionnaire", questions)


def dropCollection(collection_name):
    client = MongoClient('localhost', 27017)
    db = client['modamedicDB']
    collection = db[collection_name]
    collection.drop()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--daily", help="update daily questions", action='store_true')
    parser.add_argument("--primary", help="update primary questions", action='store_true')
    parser.add_argument("--all", help="update all questions", action='store_true')
    args = parser.parse_args()
    upload_periodic_questionnaire()
    print("periodic uploaded")
    #upload_daily_questionnaire()
    #print("daily uploaded")
    sys.stdout.flush()
    """
    if args.daily:
        upload_daily_questionnaire()
        print("daily in english uploaded")
        sys.stdout.flush()
    if args.primary:
        upload_periodic_questionnaire()
        print("primary in english uploaded")
        sys.stdout.flush()
    if args.all:
        upload_daily_questionnaire()
        upload_periodic_questionnaire()
    """
    print("all uploaded")
    sys.stdout.flush()