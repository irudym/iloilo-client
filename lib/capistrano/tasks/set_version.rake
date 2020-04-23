namespace :deploy do
  desc "Set build version"
  task :set_version do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        File.open('src/version.js','w+') do |f| 
          f.write "export const version = () => ('#{Time.now}');" 
        end
      end
    end
  end
end