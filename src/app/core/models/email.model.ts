interface EmailUserDetails {
  senderName: string;
  recipientName: string;
}
interface SendEmailDetails {
  to: string;
  dynamic_template_data: EmailUserDetails;
}
export interface SendEmail {
  delegateEmailDetails: SendEmailDetails;
}
