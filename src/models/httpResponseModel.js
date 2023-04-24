class httpResponse {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}

module.exports = httpResponse;
