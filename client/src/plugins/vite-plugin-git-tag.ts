import { execSync } from "child_process";
import { Plugin } from "vite";

function getGitTag() {
  try {
    return execSync("git describe --tags").toString().trim();
  } catch (error) {
    console.error("Error retrieving Git tag:", error);
    return "unknown";
  }
}

export function gitTagPlugin(): Plugin {
  return {
    name: "vite-plugin-git-tag",
    config: () => {
      const gitTag = getGitTag();
      console.log(gitTag)
      return {
        define: {
          __GIT_TAG__: JSON.stringify(gitTag),
        },
      };
    },
  };
}
