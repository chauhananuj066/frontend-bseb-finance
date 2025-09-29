import axios from 'axios';

const VENDOR_URL = '/vendor-api/api/Employee/GetVendorCardDetails';

export const vendorAPI = {
  // Get all vendors
  getAll: async () => {
    try {
      const response = await axios.get(VENDOR_URL);
      // API returns VendorCardDetails directly
      const vendors = response.data?.VendorCardDetails || [];
      return vendors;
    } catch (error) {
      console.error('Vendor API Error:', error);
      throw new Error('Failed to fetch vendors');
    }
  },

  // Get vendor by No_
  getByNo: async (vendorNo) => {
    try {
      const vendors = await vendorAPI.getAll();
      return vendors.find((v) => v.No_ === vendorNo);
    } catch (error) {
      throw new Error('Failed to fetch vendor details');
    }
  },
};
