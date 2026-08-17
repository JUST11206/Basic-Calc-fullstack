from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        data = request.get_json()

        num1 = float(data.get("num1"))
        num2 = float(data.get("num2"))
        operator = data.get("operator")

        if operator == "+":
            result = num1 + num2

        elif operator == "-":
            result = num1 - num2

        elif operator == "*":
            result = num1 * num2

        elif operator == "/":
            if num2 == 0:
                return jsonify({
                    "success": False,
                    "error": "Cannot divide by zero"
                }), 400

            result = num1 / num2

        elif operator == "%":
            if num2 == 0:
                return jsonify({
                    "success": False,
                    "error": "Cannot calculate modulo by zero"
                }), 400

            result = num1 % num2

        else:
            return jsonify({
                "success": False,
                "error": "Invalid operator"
            }), 400

        return jsonify({
            "success": True,
            "result": result
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "error": "Invalid numbers"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)