namespace :deploy do
  task :npm_install do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :npm, "install"
      end
    end
  end
end