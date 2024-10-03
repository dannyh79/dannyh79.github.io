---
title: 'Enforcing MFA/2FA on AWS Users'
createdAt: 2021-05-27 21:00:01 +0800
publishedAt: 2021-05-27
categories: [aws, iam]
---

## Synopsis

Use IAM policy that enforces [multi-factor authentication (MFA)](https://en.wikipedia.org/wiki/Multi-factor_authentication) to restrict access to (almost) all AWS resources on the users whose MFA is not turned on.

## Example

> The complete policy can be found on [AWS: Allows MFA-authenticated IAM users to manage their own credentials on the My Security Credentials page](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html).

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

- [AWS: Allows MFA-authenticated IAM users to manage their own credentials on the My Security Credentials page](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html)
