# Jekyll URL Helper Filter Plugin with CDN Support
# Version: 1.0.0
# Release Date: 2013-05-24
# License: MIT
# (c) Copyright Jhaura Wachsman, http://jhaurawachsman.com
# Adapted for JPress, http://getjpress.com
module Jekyll
  module Filters

    # See the README for usage examples.

    # The get_ methods grabs/returns a value from _config.yml.

    # Internal: Get the 'url' variable value from _config.yml.
    def get_url
      url = @context.registers[:site].config['url']
    end

    # Internal: Get the 'baseurl' variable value from _config.yml.
    def get_baseurl
      baseurl = @context.registers[:site].config['baseurl']
    end

    # Internal: Get the 'assetsurl' variable value from _config.yml.
    def get_assetsurl
      assetsurl = @context.registers[:site].config['assetsurl']
    end

    # The to_ methods transform a root-relative path into the path
    # type of the method name: to_<type>url.

    # Public: Append the 'baseurl' variable to 'input'.
    def to_baseurl(input)

      # baseurl << input # wouldn't work, created a huge concat chain
      input = "#{get_baseurl}#{input}"
    end

    # Public: Append the 'url' variable to 'input'.
    def to_absurl(input)

      # url + baseurl << input
      input = "#{get_url}#{get_baseurl}#{input}"
    end

    # Public: Append the 'assetsurl' variable to 'input'.
    def to_assetsurl(input)

      # baseurl + assetsurl << input
      input = "#{get_baseurl}#{get_assetsurl}#{input}"
    end

    # Public: Sanitize a string for use in a URL.
    def sanitize_str(input)
      input.gsub(/[^a-z0-9 -]+/, '').gsub(/\s/, '-').gsub(/-{2,}/, '-').downcase
    end
  end
end

Liquid::Template.register_filter(Jekyll::Filters)
