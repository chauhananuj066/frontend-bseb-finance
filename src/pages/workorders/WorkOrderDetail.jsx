import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workOrderAPI } from '@/services/api/workorders';

const WorkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        setLoading(true);
        const data = await workOrderAPI.getById(id);
        setWorkOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading work order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Error Loading Work Order</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/work-orders')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Work Order Not Found</h4>
          <button className="btn btn-primary" onClick={() => navigate('/work-orders')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Work Order Details</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/work-orders')}>
          <i className="fas fa-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Work Order #{workOrder.work_order_no}</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Work Order No:</th>
                    <td>{workOrder.work_order_no}</td>
                  </tr>
                  <tr>
                    <th>Project No:</th>
                    <td>{workOrder.project_no}</td>
                  </tr>
                  <tr>
                    <th>Issue Date:</th>
                    <td>{new Date(workOrder.issue_date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Amount:</th>
                    <td className="text-success fw-bold">
                      ₹{parseFloat(workOrder.project_amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th>Order From:</th>
                    <td>{new Date(workOrder.order_from_date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Order To:</th>
                    <td>
                      {workOrder.order_to_date
                        ? new Date(workOrder.order_to_date).toLocaleDateString()
                        : 'Open-ended'}
                    </td>
                  </tr>
                  <tr>
                    <th>Reference Tender:</th>
                    <td>{workOrder.reference_tender || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Created:</th>
                    <td>{workOrder.created_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {workOrder.remark && (
            <div className="mt-3">
              <h5>Remarks:</h5>
              <div className="alert alert-info">{workOrder.remark}</div>
            </div>
          )}

          {workOrder.work_order_file_name && (
            <div className="mt-3">
              <h5>Attached File:</h5>
              <div className="alert alert-secondary">
                <i className="fas fa-file-pdf me-2"></i>
                {workOrder.work_order_file_name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetail;
