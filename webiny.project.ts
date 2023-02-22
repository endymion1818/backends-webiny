import cliWorkspaces from "@webiny/cli-plugin-workspaces";
import cliPulumiDeploy from "@webiny/cli-plugin-deploy-pulumi";
import cliAwsTemplate from "@webiny/cwp-template-aws/cli";

// Scaffolds.
import cliScaffold from "@webiny/cli-plugin-scaffold";
import cliScaffoldExtendGraphQlApi from "@webiny/cli-plugin-scaffold-graphql-service";
import cliScaffoldAdminModule from "@webiny/cli-plugin-scaffold-admin-app-module";
import cliScaffoldCiCd from "@webiny/cli-plugin-scaffold-ci";

export default {
    appAliases: {
        core: "apps/core",
        api: "apps/api",
        admin: "apps/admin",
        website: "apps/website"
    },
    featureFlags: {
        // Enforces usage of legacy PB page elements rendering engine.
        // To migrate to the latest one, please read:
        // https://www.webiny.com/docs/page-builder-rendering-upgrade
        pbLegacyRenderingEngine: true
    },
    template: "@webiny/cwp-template-aws@5.32.0",
    name: "backend",
    cli: {
        plugins: [
            cliWorkspaces(),
            cliPulumiDeploy(),
            cliAwsTemplate(),

            // Scaffolds.
            cliScaffold(),
            cliScaffoldExtendGraphQlApi(),
            cliScaffoldAdminModule(),
            cliScaffoldCiCd()
        ]
    }
};
