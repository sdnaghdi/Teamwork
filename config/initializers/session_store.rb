# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_todo_session',
  :secret      => 'd8139054687f6ffd42a3cbe00f9511a6c9f265e9eeea5927cb4ca7767a431753037c0a1ff10040ac874ec2857b0c862cc6da62d478563b4c40ada1ca8140bef1'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
