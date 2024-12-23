# Easy Lamb TS

Parse, Build and Generate Terraform code for deploying AWS Lambda functions using Easy Lamb Terraform module.

## Features

- Parse a directory containing AWS Lambda functions written in TypeScript.
- Build Terraform code for deploying AWS Lambda functions.
- Generate Terraform code for deploying AWS Lambda functions.

## Installation

```bash
npm install -g easy-lamb-ts
```

## Usage

Create an `easy-lamb.json` file with your configuration at the root of your project:

```json
{
  "lambdaDir": "src/handlers",
  "terraformDir": "devops/terraform",
  "terraformFilename": "functions.tfvars",
  "buildOutput": "bin",
  "defaultParams": {
    "memory": "128",
    "timeout": "30",
    "runtime": "nodejs22.x",
    "authorizer": "cognito-authorizer",
    "override_env": "true"
  },
  "dotenvLocation": ".env"
}
```

Run the following commands:

```bash
# Create a functions.tfvars file
easy-lamb-ts parse
```

```bash
# Build your TypeScript functions and create functions.tfvars file
easy-lamb-ts build
```
