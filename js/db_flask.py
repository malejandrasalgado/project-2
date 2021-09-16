from flask import Flask, jsonify, request, render_template
from config import *
from sqlalchemy import create_engine
import psycopg2

## conn = psycopg2.connect(dbname="melb_pedestrian", user="postgres", password="!310B3b409", host=8000)
##url = f"postgresql://postgres:{user="postgres", pass="!310B3b409"}@localhost:8000/melb_pedestrian"
##url = f"postgresql://postgres@localhost:5432/melb_pedestrian"
url = "postgres://postgres:!310B3b409@localhost:5432/melb_pedestrian"

engine = create_engine(url)
conn = engine.connect()
##conn_cursor = url.cursor()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template ('index.html')

@app.route('/data')
def datacsv():
    data_imported = conn.fetchall()
    return render_template('data.html',data_imported)


##@app.route("/test", methods=['post', 'get'])
##def test():  
   ## conn_cursor.execute("select * from cart")
    ##result = conn_cursor.fetchall()
    ##return render_template("test.html", data=result)


if __name__ == '__main__':
    app.run(debug=True)


