from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import pandas as pd

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Load the dataset
dataset_path = '/Users/yousefmaroof/Desktop/YOUSSEF_MOHAMED_MAAROUF_MOHAMED_ABOUATTALLA_1201302598/hurricane_predictions_2024_with_distance.csv'
data = pd.read_csv(dataset_path)

# Dummy user data
users = {
    "meteorologist": "password123"
}

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return render_template('dashboard.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['POST'])
def login_post():
    username = request.form['username']
    password = request.form['password']
    if username in users and users[username] == password:
        session['username'] = username
        return redirect(url_for('dashboard'))
    return render_template('login.html', error='Invalid credentials')

@app.route('/api/data')
def get_data():
    month = request.args.get('month')
    if month:
       
        data_for_month = data[data['Month'] == int(month)]
        return data_for_month.to_json(orient='records')
    else:
        return data.to_json(orient='records')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
