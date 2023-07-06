resource "aws_api_gateway_rest_api" "word_api" {
  name        = "word-api"
  description = "API for accessing the random word"
}

resource "aws_api_gateway_resource" "word_resource" {
  rest_api_id = aws_api_gateway_rest_api.word_api.id
  parent_id   = aws_api_gateway_rest_api.word_api.root_resource_id
  path_part   = "word"
}

resource "aws_api_gateway_method" "word_method" {
  rest_api_id   = aws_api_gateway_rest_api.word_api.id
  resource_id   = aws_api_gateway_resource.word_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "word_integration" {
  rest_api_id             = aws_api_gateway_rest_api.word_api.id
  resource_id             = aws_api_gateway_resource.word_resource.id
  http_method             = aws_api_gateway_method.word_method.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.serve_word.invoke_arn

  depends_on = [aws_lambda_permission.api_gateway_permission]
}


resource "aws_api_gateway_deployment" "word_deployment" {
  rest_api_id = aws_api_gateway_rest_api.word_api.id
  stage_name  = "prod"
}
