class Grepa < Formula
  desc "Grep-anchor tools for making codebases discoverable"
  homepage "https://github.com/galligan/grepa"
  url "https://github.com/galligan/grepa/archive/v0.1.0.tar.gz"
  sha256 "" # Will be filled when you create a release
  license "MIT"

  depends_on "node@20"
  depends_on "ripgrep"

  def install
    system "npm", "install", *std_npm_args(prefix: false)
    system "npm", "run", "build", "--workspace=packages/core"
    system "npm", "run", "build", "--workspace=packages/cli"
    
    # Install the CLI globally
    system "npm", "install", "-g", "--prefix=#{prefix}", "packages/cli"
  end

  test do
    system "#{bin}/grepa", "--version"
    assert_match "0.1.0", shell_output("#{bin}/grepa --version")
  end
end