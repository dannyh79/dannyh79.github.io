---
layout:     post
title:      "Migrate with AWS - AWS Application Migration Workshop"
date:       2020-10-08 20:25:52 +0800
categories: ["workshop", "aws"]
comments:   true

---
## TDLR
These are notes taken from the workshop that covers the following:
- Migrate database with AWS DMS (Database Migration Service)
- Move on-premise or virtual instances onto EC2s with AWS CloudEndure
- Build a scalable website with AWS ECS

## Preface
These are notes taken from the AWS-hosted event of [Migrate with AWS](https://application-migration-with-aws.workshop.aws/){:rel="nofollow noopener noreferrer" target="_blank"}, which means they are probably not 100% applicable when you choose to run it on your own. The basics, however, like setting up Security Groups (SGs), should be the same.

If you were to run the workshop, you may use [running the workshop in your own AWS account](https://application-migration-with-aws.workshop.aws/en/intro/on-your-own.html){:rel="nofollow noopener noreferrer" target="_blank"} from Getting Started.

## Lab 1 - Database Migration
- Write to source database is okay during the migration. :)
- An EC2 replication instance is needed for DMS to transfer the data, and to cache the changes occur on the source database during the initial data load
- Remember to disable foreign key checks in Endpoint-specific setting in DMS > Endpoints > Create endpoint, so the migration will not fail because of [FOREIGN KEY Constraint](https://www.w3schools.com/sql/sql_foreignkey.asp){:rel="nofollow noopener noreferrer" target="_blank"}

## Lab 2 - Server Migration
- SSH to the web server and install CloudEndure agent
- Prepare blueprint of target instance on AWS
- Once instance volumes are fully replicated, a test or cutover can be performed. According to best practice, there should be a pilot-run at least one week before the target migration date
- Update SG for the RDS instance to allow inbound traffic from the web server

## Lab 3 - Move to Containers
- An ECS cluster is a logical grouping of resources
- ECS clusters may be launched on AWS Fargate that provides managed compute capabilities for containers, or on an EC2 instance
- Task Definition, the blueprint of the tasks, is a JSON file that describes one to 10 containers that form the application
- Task is an instantiation of a task definition within a cluster
- A Service is composed of a specified number of instances of a task definition in a cluster. If the tasks fail or stop, depending on the scheduling strategy, the ECS service scheduler will launch another instance(s) of your task definition to replace the old one(s)
- Use ELB (Elastic Load Balancer) as the front for the service

## Optimization
- CloudWatch dashboard can be customized into views according to the needs
- Configure CloudTrail to monitor, audit, and alert on what is happening in your AWS account
- Deploying static content with CloundFront and S3 for low latency for your target audience and lower cost

## Pour Closure
Security wise, AWS provides an array of firewall options: SGs (at instance level), ACL (at subnet level), [WAF (Web Application Firewall)](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html){:rel="nofollow noopener noreferrer" target="_blank"}, AWS Shield (has features to protect sites that are prone to frequent DDoS attacks), etc. A detailed comparison of SG and ACL can be found [here](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html#VPC_Security_Comparison){:rel="nofollow noopener noreferrer" target="_blank"}.

As for best practices when working in the cloud, there are some worth mentioning:
- Review application architecture often
- Make frequent, granular, reversible changes
- Make decisions base on data; no more "I think" or "It probably is"s
- Improve through Game Days (simulations to test software engineers' responsiveness and whether current application architecture is resilient to failures)

The thing that is lacking in this workshop, though, is that it did not cover [IAM (Identity and Access Management)](https://www.youtube.com/watch?v=YQsK4MtsELU){:rel="nofollow noopener noreferrer" target="_blank"}, a very important part when it comes to management and cybersecurity. Since the concept for IAM and its use cases is probably too much to fit into a day's training with all above, my guess is it was excluded on purpose.

## References
- [AWS Application Migration Workshop](https://application-migration-with-aws.workshop.aws/en/){:rel="nofollow noopener noreferrer" target="_blank"}
- [AWS Networking Fundamentals (YouTube)](https://www.youtube.com/watch?v=hiKPPy584Mg){:rel="nofollow noopener noreferrer" target="_blank"}
- [AWS re:Invent 2018: Become an IAM Policy Master in 60 Minutes or Less (YouTube)](https://www.youtube.com/watch?v=YQsK4MtsELU){:rel="nofollow noopener noreferrer" target="_blank"}
