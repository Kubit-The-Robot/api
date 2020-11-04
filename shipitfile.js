module.exports = function (shipit) {
	require("shipit-deploy")(shipit);

	const REPOSITORY = "git@github.com:Kubit-The-Robot/api.git";
	const NAME = "api.kubitbot.com.br";

	shipit.initConfig({
		default: {
			workspace: "/tmp/kubit-api",
			repositoryUrl: REPOSITORY,
			ignores: [".git", "node_modules"],
			keepReleases: 3,
			servers: "ubuntu@kubitbot.com.br",
		},
		production: {
			deployTo: `/home/ubuntu/${NAME}`,
			branch: "main",
			port: "3333",
		},
	});

	shipit.blTask("npm", ["deploy"], function () {
		return shipit.remote(`cd ${shipit.releasePath} && npm install`);
	});

	shipit.blTask("restart", ["npm"], function () {
		shipit.remote(
			`pm2 delete ${NAME} || true && cd ${shipit.currentPath} && PORT=3333 pm2 start src/index.js -f --name=${NAME}`
		);
	});

	shipit.start("deploy", "npm", "restart");
};
