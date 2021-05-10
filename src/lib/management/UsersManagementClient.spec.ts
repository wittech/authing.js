import { ManagementClient } from './ManagementClient';
import {
  generateRandomPhone,
  generateRandomString,
  getOptionsFromEnv
} from '../testing-helper';
import test from 'ava';
import moment from 'moment';
import { ResourceType } from '../../types/graphql.v2';
import { AuthenticationClient } from '../authentication/AuthenticationClient';

const managementClient = new ManagementClient(getOptionsFromEnv());
const authenticationClient = new AuthenticationClient(getOptionsFromEnv());

test('创建用户', async t => {
  const username = generateRandomString(10);
  const email = generateRandomString(10);
  const phone = generateRandomPhone();
  const unionid = generateRandomString(10);
  const user = await managementClient.users.create({
    username,
    email,
    phone,
    unionid
  });
  t.assert(user);
  t.assert(user.email === email.toLowerCase());
  t.assert(user.username === username);
  t.assert(user.phone === phone);
  t.assert(user.unionid === unionid);
});

test('创建用户 # 必须指定一种唯一标志', async t => {
  let failed = false;
  try {
    await managementClient.users.create({
      password: generateRandomString(10)
    });
  } catch {
    failed = true;
  }
  t.assert(failed);
});

test('创建用户 # 时间格式1', async t => {
  let user = await managementClient.users.create({
    username: generateRandomString(),
    lastLogin: '2017-06-07T14:34:08+04:00'
  });
  user = await managementClient.users.detail(user.id);
  t.assert(user);
});

test('创建用户 # signedUp', async t => {
  const signedUp = '2017-06-07T14:34:08+04:00';
  let user = await managementClient.users.create({
    username: generateRandomString(),
    signedUp
  });
  user = await managementClient.users.detail(user.id);
  t.assert(moment(user.signedUp).unix() === moment(signedUp).unix());
});

test('创建用户 # 错误时间格式', async t => {
  let failed = false;
  try {
    await managementClient.users.create({
      username: generateRandomString(),
      lastLogin: '1602756997950'
    });
  } catch {
    failed = true;
  }
  t.assert(failed);
});

test('检查用户是否存在', async t => {
  const exists1 = await managementClient.users.exists({
    username: generateRandomString(10)
  });
  t.assert(exists1 === false);

  const username = generateRandomString(10);
  const email = generateRandomString(10) + '@qq.com';
  const phone = generateRandomPhone();
  await managementClient.users.create({
    username
  });
  t.assert(await managementClient.users.exists({ username }));
  await managementClient.users.create({ email });
  t.assert(await managementClient.users.exists({ email }));
  await managementClient.users.create({ phone });
  t.assert(await managementClient.users.exists({ phone }));
});

test('查询用户详情', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: generateRandomString()
  });
  const detail = await managementClient.users.detail(user.id);
  t.assert(user.id === detail.id);
});

test('查询用户详情 # 不属于该用户池的用户', async t => {
  const detail = await managementClient.users.detail('xxx');
  t.assert(detail === null);
});

test.skip('detail withCustomData', async t => {
  const user = await managementClient.users.detail('608501a35c97c0520049e71e', {
    withCustomData: true
  });
  console.log(user);
  t.assert(user);
});

test.skip('find withCustomData', async t => {
  const user = await managementClient.users.find({
    withCustomData: true,
    phone: '15210165828'
  });
  console.log(user);
  t.assert(user);
});

test.skip('batch withCustomData', async t => {
  const user = await managementClient.users.batch(
    ['608501a35c97c0520049e71e'],
    {
      queryField: 'id',
      withCustomData: true
    }
  );
  console.log(user);
  t.assert(user);
});

test('list withCustomData', async t => {
  const user = await managementClient.users.list(1, 10, {
    withCustomData: true
  });
  console.log(user);
  t.assert(user);
});

test('批量查询用户', async t => {
  const list = [];
  for (let i = 0; i <= 10; i++) {
    const user = await managementClient.users.create({
      username: generateRandomString(10),
      password: '123456!'
    });
    list.push(user.id);
  }
  const data = await managementClient.users.batch(list);
  t.assert(data.length === list.length);
});

test('搜索用户', async t => {
  const query = 'c';
  const { list, totalCount } = await managementClient.users.search(query);
  t.assert(list !== undefined);
  t.assert(totalCount !== undefined);
});

test('修改用户资料', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });

  const nickname = generateRandomString(10);
  const updated = await managementClient.users.update(user.id, {
    nickname
  });
  t.assert(updated.nickname === nickname);
});

test('修改用户资料 # 邮箱', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });

  const email = generateRandomString() + '@test.com';
  const updated = await managementClient.users.update(user.id, {
    email
  });
  t.assert(updated.email === email.toLowerCase());
});

test('修改用户资料 # 手机号', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });

  const phone = generateRandomPhone();
  const updated = await managementClient.users.update(user.id, {
    phone
  });
  t.assert(updated.phone === phone);
});

test('获取用户角色列表', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });

  const role = await managementClient.roles.create(generateRandomString());
  await managementClient.roles.addUsers(role.code, [user.id]);

  const roles = await managementClient.users.listRoles(user.id);
  t.assert(roles.totalCount === 1);
  t.assert(roles.list[0].code === role.code);
});

test.skip('获取用户角色列表 namespace', async t => {
  const roles = await managementClient.users.listRoles(
    '603f567865d782899ffb0b6e',
    '603f52f97cd214a8805c0cc8'
  );
  console.log(roles);
  t.assert(roles);
});

test('删除用户', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });
  await managementClient.users.delete(user.id);
  const user2 = await managementClient.users.detail(user.id);
  t.assert(user2 === null);
});

test('refreshToken', async t => {
  const user = await managementClient.users.create({
    username: generateRandomString(),
    password: '123456!'
  });
  const { token } = await managementClient.users.refreshToken(user.id);
  t.assert(token);
  const data = await managementClient.checkLoginStatus(token, {
    fetchUserDetail: true
  });
  t.assert(user.id === data.id);
});

test.skip('获取用户组织机构列表', async t => {
  const data = await managementClient.users.listOrgs(
    '5f9976a7389b6dccb23a4c54'
  );
  t.assert(data);
});

test.skip('listAuthorizedResources', async t => {
  const data = await managementClient.users.listAuthorizedResources(
    '603f2c49e91d695739d7206c',
    '6018bab016c246d458ef0ad2',
    {
      resourceType: ResourceType.Menu
    }
  );
  console.log(JSON.stringify(data, null, 4));
  t.assert(data);
});

test('自定义数据', async t => {
  const userId = '603f2c49e91d695739d7206c';
  await managementClient.users.setUdfValue(userId, {
    school: '华中科技大学'
  });
  const data = await managementClient.users.getUdfValue(userId);
  console.log(data);
  t.assert(data);

  await managementClient.users.removeUdfValue(userId, 'school');
  const data2 = await managementClient.users.getUdfValue(userId);
  console.log(data2);
  t.assert(data);
});

test('getUdfValueBatch', async t => {
  const userId = '603f2c49e91d695739d7206c';
  await managementClient.users.setUdfValue(userId, {
    school: '华中科技大学'
  });

  const data = await managementClient.users.getUdfValueBatch([userId]);
  console.log(data);
  t.assert(data);
});

test('setUdfValueBatch', async t => {
  t.assert(true);
  try {
    await managementClient.users.setUdfValueBatch([
      {
        userId: '603f2c49e91d695739d7206c',
        data: {
          school: '华中科技大学'
        }
      },
      {
        userId: '603f2c4910dfc09f1f3ecce5',
        data: {
          school: '清华大学',
          age: 100
        }
      }
    ]);
    const data = await managementClient.users.getUdfValueBatch([
      '603f2c49e91d695739d7206c',
      '603f2c4910dfc09f1f3ecce5'
    ]);
    console.log(data);
    t.assert(data);
  } catch (error) {
    console.log(error);
  }
});

test('踢下线一批用户', async t => {
  let username = Math.random()
    .toString(26)
    .slice(2);
  let pwd = '123456';
  let user = await managementClient.users.create({ username, password: pwd });
  let data = await managementClient.users.kick([user.id]);
  t.assert(data.code === 200);
});

test.only('用户池管理员根据用户 id 查询用户的登录状态', async t => {
  let username = Math.random()
    .toString(26)
    .slice(2);
  let pwd = '123456';
  let user = await managementClient.users.create({ username, password: pwd });
  await authenticationClient.loginByUsername(username, pwd);
  let res2 = await managementClient.users.checkLoginStatus(user.id);
  t.assert(res2.isLogin === true)
  t.assert(res2.user)
  t.assert(res2.application.length > 0)
});
