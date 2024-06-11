const createWorkspaceButton = document.getElementById(
  "create-workspace-button"
);
const readWorkspaceButton = document.getElementById("read-workspace-button");
const workspaceInput = document.getElementById("workspace-input");

const workspaceInfo = document.getElementById("workspace-info");

export function setupWorkspace() {
  createWorkspaceButton.onclick = async () => {
    const workspaceId = workspaceInput.value;
    const request = await fetch(
      `https://api.komputer.space/workspaces/${workspaceId}`,
      { method: "POST", body: JSON.stringify({ blup: "ABCED", test: 13 }) }
    );
    const result = await request.json();

    localStorage.setItem("current-workspace", workspaceId);
  };

  const fetchWorkspaces = async () => {
    const request = await fetch("https://api.komputer.space/workspaces");
    const { workspaces } = await request.json();

    workspaces.forEach((workspace) => {
      const element = document.createElement("p");
      element.innerText = workspace.id;

      workspaceInfo.append(element);
    });
  };

  void fetchWorkspaces();
}
