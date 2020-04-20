# iLoiLo Client application

**ilo ilo** means *evaluate* in Malay language, at least Google Translate says so.

The application which allows users to connect to iLoiLo quizzes and answer questions. It's written in JS with Vue framework thus requires
installed NodeJS on your machine.

## Features
There are many tools to create quizzes and tests, evaluate knowledge of students, colleagues, and just friends. However many of the tools are overloaded with features and sometime it's hard to use them. The objectives of this application to create a simple and yet powerful tool to create test, collect responses and build reports with detailed information. 


## Project setup

### Requirements
* NodeJS v13.11.0 or later
* Ruby 2.5.1 or later (mostly for deploying purposes)

### Installation
In order to setup the project, run following command
```
yarn install
```

## Deployment
For deploying purposes the application uses [Capistrano](https://capistranorb.com/) - a remote server automation tool. The builded application may be server as static pages.

### Configuration

### Deploying
To deploy the project on any remote server with ngnix installed, run following command
```
cap production deploy
```


## License 

MIT License (MIT)

Copyright (c) 2012-2020 Igor Rudym

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.