function successMessage(message) {
  return {
    color: 'positive',
    textColor: this.textColor,
    icon: 'check',
    position: this.notifPosition,
    message,
    actions: this.notifActions,
  };
}

function pendingMessage(message) {
  return {
    html: true,
    color: 'primary',
    textColor: this.textColor,
    icon: 'hourglass_empty',
    position: this.notifPosition,
    timeout: 0,
    message,
    actions: this.notifActions,
  };
}

function failMessage(message) {
  return {
    color: 'negative',
    textColor: this.textColor,
    icon: 'priority_high',
    position: this.notifPosition,
    message,
    actions: this.notifActions,
  };
}

export default {
  data() {
    return {
      notifPosition: 'bottom-right',
      textColor: 'white',
      notifActions: [
        { label: 'Ok', color: 'yellow' },
      ],
    };
  },
  methods: {
    successMessage,
    pendingMessage,
    failMessage,
  },
};
