namespace :deploy do
  desc "Set build version"
  task :set_version do
    on roles(:app), in: :sequence, wait: 5 do
      within shared_path do
        location = "#{shared_path}/version/version.js"
        text = "export const iloVersion = () => ('#{Time.now}');"
        execute :cp, "#{release_path}/.eslintrc.js", "#{shared_path}/version"
        execute :echo, "\"#{text}\"", '>', location
      end
    end
  end
end