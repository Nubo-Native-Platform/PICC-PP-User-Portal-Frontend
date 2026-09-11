export interface UserModel {
  contactNumber?: string;
  emailId?: string;
  envId?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  roleLabel?: string;
  updateComment?: string;
  updateDate?: string;
  userId?: string;
  userStatus?: string;
  userType?: string;
  category?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  password?: string;
}
