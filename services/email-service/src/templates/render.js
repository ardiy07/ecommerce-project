const templates = {
    'welcome': require('./welcome'),
    'send-otp': require('./send-otp')
};

const render = (topic, data) => {
    const template = templates[topic];
    if (!template) {
        throw new Error('Template not found');
    }
    return template(data);
}

module.exports = render