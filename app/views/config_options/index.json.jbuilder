json.array!(@config_options) do |config_option|
  json.extract! config_option, :id, :config_name, :config_value
  json.url config_option_url(config_option, format: :json)
end
