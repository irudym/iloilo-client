namespace :deploy do
  desc "Set build version"
  task :set_version do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        location = fetch(:latest_release, "src") + '/version.js'
        puts "LOCATION: #{location}, RELEASE: #{fetch(:latest_release)}" 
        execute "echo test >> #{location}"
      end
    end
  end
end