# MEAN STACK

- Backend
Hosted in AWS (Elastic Beanstalk) , Go inside the backend folder zip everything and upload the zip, The environment variables are given to EB through option.config

- Frontend
Is hosted through AWS S3, run 'ng build --configuration development' , goto dist folder upload everything to the s3 bucket, goto properties enable 'static hosting' , dont forget to make it public
