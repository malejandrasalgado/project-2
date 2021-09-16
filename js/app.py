from flask import Flask, jsonify, request, render_template




app = Flask(__name__)

@app.route('/')
def home():
    return render_template ('index.html')

@app.route('/data')
def datascv():
    data_imported = [0,1,2]
    return render_template('data.html',kelly=data_imported)


if __name__ == '__main__':
    app.run(debug=True)


