OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '689577704510810', '636f884cadc0c6b4b1282204308c6adf', {:client_options => {:ssl => {:verify => false}}}
end