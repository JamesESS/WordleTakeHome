resource "aws_lambda_function" "update_word" {
  filename      = "updateWord.zip"
  function_name = "update-word-lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "updateWord.handler"
  runtime       = "nodejs14.x"
  timeout       = 10

  source_code_hash = filebase64sha256("updateWord.zip")
}

resource "aws_lambda_function" "serve_word" {
  filename      = "serveWord.zip"
  function_name = "serve-word-lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "serveWord.handler"
  runtime       = "nodejs14.x"
  timeout       = 10

  source_code_hash = filebase64sha256("serveWord.zip")
}


resource "aws_iam_role" "lambda_role" {
  name = "lambda-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "lambda_policy_attachment" {
  name       = "lambda-policy-attachment"
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  roles      = [aws_iam_role.lambda_role.name]
}


resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_word.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_iam_policy_attachment" "cloudwatch_policy_attachment" {
  name       = "cloudwatch-policy-attachment"
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  roles      = [aws_iam_role.lambda_role.name]
}
