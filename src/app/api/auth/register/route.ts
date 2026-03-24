import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/userStore";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    // #region agent log
    fetch('http://127.0.0.1:7258/ingest/f82cf353-cf8e-4112-908e-065b41e8bfee',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80e2aa'},body:JSON.stringify({sessionId:'80e2aa',location:'register/route.ts:8',message:'Register attempt (file-based)',data:{email,name,hasPassword:!!password},timestamp:Date.now(),hypothesisId:'FIX'})}).catch(()=>{});
    // #endregion

    if (!email || !name || !password) {
      return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      );
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = createUser(email, name, hashedPassword);

    // #region agent log
    fetch('http://127.0.0.1:7258/ingest/f82cf353-cf8e-4112-908e-065b41e8bfee',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80e2aa'},body:JSON.stringify({sessionId:'80e2aa',location:'register/route.ts:33',message:'User created successfully (file-based)',data:{userId:user.id,email:user.email},timestamp:Date.now(),hypothesisId:'FIX'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err: unknown) {
    // #region agent log
    fetch('http://127.0.0.1:7258/ingest/f82cf353-cf8e-4112-908e-065b41e8bfee',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'80e2aa'},body:JSON.stringify({sessionId:'80e2aa',location:'register/route.ts:44',message:'REGISTER CATCH ERROR (file-based)',data:{error:String(err),stack:(err instanceof Error)?err.stack:''},timestamp:Date.now(),hypothesisId:'FIX'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ error: "注册失败，请重试" }, { status: 500 });
  }
}
