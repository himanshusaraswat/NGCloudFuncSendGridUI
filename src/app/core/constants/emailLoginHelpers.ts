export const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const onlyAlpha = /^[A-Za-z ]+$/;
export const validationMessagesExistingEmail = {
        required: 'Email is required.',
        pattern: 'Email must be a valid email.'
};
export const snackBarMessage = {
        success: 'Your email is sent',
        error: 'Your email was not sent, please try again'
};
export const sendEmail = {
        welcome: 'Check Your MailBox For A login Link'
};
export interface EmailMissing {
        emailMissing: boolean;
        url?: string;
}
