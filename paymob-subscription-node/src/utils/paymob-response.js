function sanitizeAxiosError(error) {
  return {
    message: error.message,
    status: error.response?.status || 500,
    data: error.response?.data || null,
  };
}

function sendPaymobResponse(res, response) {
  return res.status(response.status).json(response.data);
}

module.exports = { sanitizeAxiosError, sendPaymobResponse };
