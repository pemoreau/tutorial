from flask import Flask
from flask import request
from flask import redirect

app = Flask(__name__)

@app.route("/")
def hello():
	return redirect('http://www.depinfonancy.net')

@app.route('/user/<name>')
def user(name):
	return redirect('http://www.loria.fr/~%s' % name)

if __name__ == "__main__":
	app.run()
