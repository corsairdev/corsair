// swift-tools-version:5.9
import PackageDescription

let package = Package(
	name: "CorsairCloud",
	platforms: [.macOS(.v12), .iOS(.v15)],
	products: [
		.library(name: "CorsairCloud", targets: ["CorsairCloud"]),
	],
	targets: [
		.target(name: "CorsairCloud"),
		.testTarget(name: "CorsairCloudTests", dependencies: ["CorsairCloud"]),
	]
)
