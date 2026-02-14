function checkEmailAPI() {
    // Simulated email fetch
    const emails = [
        {
            from: "manager@company.com",
            subject: "Project Update",
            body: "Please send the updated report by tomorrow."
        },
        {
            from: "friend@email.com",
            subject: "Weekend Plan",
            body: "Are you free this Saturday?"
        }
    ];

    const summary = emails.map(email => {
        return `From: ${email.from} | Subject: ${email.subject}`;
    });

    return {
        emails,
        summary
    };
}

module.exports = { checkEmailAPI };
