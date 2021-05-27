---
layout:     post
title:      "Enforcing MFA/2FA on AWS users"
date:       2021-05-27 21:00:01 +0800
categories: ["aws", "iam"]
comments:   true

---
## Synopsis
Use IAM policy that enforces [multi-factor authentication (MFA)](https://en.wikipedia.org/wiki/Multi-factor_authentication){:rel="nofollow noopener noreferrer" target="blank"} to restrict access to (almost) all AWS resources on the users whose MFA is not turned on.

## Example
> The complete policy can be found on [AWS: Allows MFA-authenticated IAM users to manage their own credentials on the My Security Credentials page](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html){:rel="nofollow noopener noreferrer" target="blank"}.

To let users that have not set up MFA change their password, I'd put `"iam:ChangePassword"` in `"DenyAllExceptListedIfNoMFA"`'s `"NotAction"` list:
```js
{
    "Version": "2012-10-17",
    "Statement": [
        // ...omitted
        {
            "Sid": "DenyAllExceptListedIfNoMFA",
            "Effect": "Deny",
            "NotAction": [
                "iam:CreateVirtualMFADevice",
                "iam:EnableMFADevice",
                "iam:GetUser",
                "iam:ListMFADevices",
                "iam:ListVirtualMFADevices",
                "iam:ResyncMFADevice",
                "sts:GetSessionToken",
                "iam:ChangePassword"
            ],
            "Resource": "*",
            "Condition": {
                "BoolIfExists": {
                    "aws:MultiFactorAuthPresent": "false"
                }
            }
        }
    ]
}
```

## References
- [AWS: Allows MFA-authenticated IAM users to manage their own credentials on the My Security Credentials page](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html){:rel="nofollow noopener noreferrer" target="blank"}
