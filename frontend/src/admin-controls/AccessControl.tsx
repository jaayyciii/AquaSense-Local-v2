import { useEffect, useState } from "react";
import { ContextType } from "../home/HomeLayout";
import ConfirmDelete from "./ConfirmDelete";

type AccountType = {
  uid: string;
  email: string;
  name: string;
  admin: boolean;
};

export default function AccessControl({ setPrompt }: ContextType) {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [deleteAccount, setDeleteAccount] = useState<string>("");
  const [editAccounts, setEditAccounts] = useState<AccountType[]>([]);
  const [isEditAllowed, setIsEditAllowed] = useState<boolean>(false);
  const [retrievingAccounts, setIsRetrievingAccounts] = useState<boolean>(true);

  useEffect(() => {
    getAccounts();
  }, []);

  async function getAccounts() {
    setIsRetrievingAccounts(true);
    setAccounts([]);
    try {
      const response = await fetch(`http://localhost:8000/get-accounts/`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      const initialAccounts = data.map((account: any) => ({
        uid: account.uid,
        email: account.email,
        name: account.name,
        admin: account.role === "A",
      }));
      setAccounts(initialAccounts);
      setEditAccounts(initialAccounts);
      setIsRetrievingAccounts(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    const updates = editAccounts
      .map((account, idx) => {
        if (account.admin !== accounts[idx].admin) {
          return { uid: account.uid, role: account.admin ? "A" : "G" };
        }
        return null;
      })
      .filter((account) => account != null);

    if (updates.length === 0) {
      setIsEditAllowed(false);
      return;
    }

    try {
      await Promise.all(
        updates.map((update) =>
          fetch("http://localhost:8000/set-account/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(update),
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update roles for uid: " + update.uid);
            }
          })
        )
      );

      setAccounts(editAccounts);
      setIsEditAllowed(false);
      setPrompt(
        "User roles has been successfully applied. Please check to verify the changes."
      );
    } catch (error) {
      console.error(error);
      setPrompt(
        "Oops! Something went wrong. New user role assignment was unsuccessful. Please try again or check your connection"
      );
    }
  }

  function handleCancel() {
    setEditAccounts(accounts);
    setIsEditAllowed(false);
  }

  function handleToggle(accountIdx: number) {
    setEditAccounts((prevAccounts) =>
      prevAccounts.map((acc, idx) =>
        idx === accountIdx ? { ...acc, admin: !acc.admin } : acc
      )
    );
  }

  return (
    <>
      <ConfirmDelete
        getAccounts={getAccounts}
        deleteAccount={deleteAccount}
        disable={retrievingAccounts || !isEditAllowed}
      />
      <div className="d-flex flex-column shadow rounded p-4 w-100">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 style={{ fontSize: "18px" }}>Remote Access Control</h5>
          <div className="d-flex gap-2">
            {!isEditAllowed ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-flex align-items-center px-2"
                style={{ height: "30px" }}
                onClick={() => setIsEditAllowed(true)}
              >
                <i
                  className="bi bi-person-check"
                  style={{ fontSize: "18px" }}
                />
                <span className="ms-2 d-none d-md-flex">Manage Accounts</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-primary d-flex align-items-center px-2"
                  style={{ height: "30px" }}
                  onClick={handleCancel}
                >
                  <span className="d-none d-md-flex">Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center px-2"
                  style={{ height: "30px" }}
                  onClick={handleSave}
                >
                  <span className="d-none d-md-flex">Save Actions</span>
                </button>
              </>
            )}
          </div>
        </div>
        <p className="fw-light mb-3" style={{ fontSize: "16px" }}>
          Assign roles for administrators with full access and guests with
          limited capabilities, ensuring appropriate permissions for all.
        </p>
        <div style={{ height: "480px", overflowY: "auto" }}>
          <table className="table table-hover m-0">
            <thead className="table sticky-top">
              <tr>
                <th className="fw-medium fs-6 col-5">Email</th>
                <th className="fw-medium fs-6 col-6">Account Name</th>
                <th className="fw-medium fs-6 col-1">Admin</th>
                <th className="fw-medium fs-6 col-1" />
              </tr>
            </thead>
            <tbody className="table-group-divider" style={{ fontSize: "14px" }}>
              {retrievingAccounts ? (
                Array.from({ length: 3 }, (_, index) => (
                  <tr key={index} className="placeholder-glow">
                    <td>
                      <span className="placeholder col-12" />
                    </td>
                    <td>
                      <span className="placeholder col-12" />
                    </td>
                    <td>
                      <span className="placeholder col-12" />
                    </td>
                  </tr>
                ))
              ) : editAccounts.length > 0 ? (
                editAccounts.map((account, idx) => (
                  <tr key={account.uid}>
                    <td>{account.email}</td>
                    <td>{account.name}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          onChange={() => handleToggle(idx)}
                          checked={account.admin}
                          disabled={!isEditAllowed}
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn bi-trash border-0 py-0"
                        style={{ fontSize: "14px" }}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteAccount"
                        onClick={() => setDeleteAccount(account.uid)}
                        disabled={!isEditAllowed}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-muted">
                    No Accounts Registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
