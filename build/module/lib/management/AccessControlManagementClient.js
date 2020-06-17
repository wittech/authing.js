import { userGroupList } from './../graphqlapi/management.accesscontrol.userGroupList';
import { isUserInGroup } from './../graphqlapi/management.accesscontrol.isUserInGroup';
import { groupUserList } from './../graphqlapi/management.accesscontrol.groupUserList';
import { addUserToRBACGroup } from './../graphqlapi/management.accesscontrol.addUserToGroup';
import { addGroupMetadata } from './../graphqlapi/management.accesscontrol.addGroupMetadata';
import { createRBACGroup } from './../graphqlapi/management.accesscontrol.createGroup';
export class AccessControlManagementClient {
    constructor(options, graphqlClient, tokenProvider) {
        this.options = options;
        this.graphqlClient = graphqlClient;
        this.tokenProvider = tokenProvider;
    }
    /**
     * 创建 Group
     *
     * @param {string} name
     * @param {string} description
     * @returns {Promise<AuthingGroup>}
     * @memberof AccessControlManagementClient
     */
    async createGroup(name, description) {
        const res = await createRBACGroup(this.graphqlClient, this.tokenProvider, {
            input: {
                userPoolId: this.options.userPoolId,
                name,
                description
            }
        });
        const group = res.createRBACGroup;
        return group;
    }
    /**
     * 为 Group 添加自定义数据
     *
     * @param {string} groupId
     * @param {string} key
     * @param {*} value
     * @returns {Promise<{ key: string, value: string }>}
     * @memberof AccessControlManagementClient
     */
    async addGroupMetadata(groupId, key, value) {
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        const res = await addGroupMetadata(this.graphqlClient, this.tokenProvider, {
            groupId,
            key,
            value
        });
        return res.addGroupMetadata;
    }
    /**
     *  添加用户到分组中
     *
     * @param {{
     *     userId: string,
     *     groupId: string
     *   }} options
     * @returns
     * @memberof AccessControlManagementClient
     */
    async addUserToGroup(options) {
        const res = await addUserToRBACGroup(this.graphqlClient, this.tokenProvider, { input: options });
        return res.addUserToRBACGroup;
    }
    /**
     * 判断用户是否在 Group 中
     *
     * @memberof AccessControlManagementClient
     */
    async isUserInGroup(options) {
        const res = await isUserInGroup(this.graphqlClient, this.tokenProvider, options);
        return res.isUserInGroup;
    }
    /**
     * 查询 Group 用户列表
     *
     * @param {string} groupId
     * @param {{
     *     sortBy: string, 默认为 CREATEDAT_DESC
     *     page: number, 默认为 0
     *     count: number 默认为 10
     *   }} options
     * @returns
     * @memberof AccessControlManagementClient
     */
    async groupUserList(groupId, options) {
        options = Object.assign({
            sortBy: "CREATEDAT_DESC",
            page: 0,
            count: 1
        }, options);
        const res = await groupUserList(this.graphqlClient, this.tokenProvider, Object.assign({}, options, { groupId }));
        return res.rbacGroup.users;
    }
    /**
     * 查询用户所在的分组列表
     *
     */
    async userGroupList(userId) {
        const res = await userGroupList(this.graphqlClient, this.tokenProvider, {
            _id: userId
        });
        return res.userGroupList;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjZXNzQ29udHJvbE1hbmFnZW1lbnRDbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21hbmFnZW1lbnQvQWNjZXNzQ29udHJvbE1hbmFnZW1lbnRDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDdkYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFDN0YsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDN0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBS3ZGLE1BQU0sT0FBTyw2QkFBNkI7SUFLeEMsWUFBWSxPQUFnQyxFQUFFLGFBQTRCLEVBQUUsYUFBc0M7UUFDaEgsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7SUFDcEMsQ0FBQztJQUdEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQVksRUFBRSxXQUFtQjtRQUNqRCxNQUFNLEdBQUcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDeEUsS0FBSyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVU7Z0JBQ25DLElBQUk7Z0JBQ0osV0FBVzthQUNaO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQTtRQUNqQyxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFHRDs7Ozs7Ozs7T0FRRztJQUNILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFlLEVBQUUsR0FBVyxFQUFFLEtBQVU7UUFDN0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDOUI7UUFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN6RSxPQUFPO1lBQ1AsR0FBRztZQUNILEtBQUs7U0FDTixDQUFDLENBQUE7UUFDRixPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQTtJQUM3QixDQUFDO0lBR0Q7Ozs7Ozs7OztPQVNHO0lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUdwQjtRQUNDLE1BQU0sR0FBRyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDaEcsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUE7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BR25CO1FBQ0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2hGLE9BQU8sR0FBRyxDQUFDLGFBQWEsQ0FBQTtJQUMxQixDQUFDO0lBR0Q7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQWUsRUFBRSxPQUlwQztRQUNDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUUsQ0FBQztTQUNULEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDWCxNQUFNLEdBQUcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2hILE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBYztRQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEUsR0FBRyxFQUFFLE1BQU07U0FDWixDQUFDLENBQUE7UUFDRixPQUFPLEdBQUcsQ0FBQyxhQUFhLENBQUE7SUFDMUIsQ0FBQztDQUNGIn0=