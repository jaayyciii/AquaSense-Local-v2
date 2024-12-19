type ConfirmDeleteType = {
  getAccounts: () => Promise<void>;
  deleteAccount: string;
  disable: boolean;
};

export default function ConfirmDelete({
  getAccounts,
  deleteAccount,
  disable,
}: ConfirmDeleteType) {
  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:8000/delete-account/${deleteAccount}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      getAccounts();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="modal fade" id="deleteAccount">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Confirm Action
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body">
            Are you sure you want to delete this account?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={handleDelete}
              disabled={disable}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
