// 由 Google Gemini 生成
// 参见：https://g.co/gemini/share/d86869fd2f37

/**
 * 算法目标：
 * 根据输入数组 I，计算出一个新的数组 O (圆的半径集合)，
 * 使得 O[k] 服从 O[k] = a*(I[k]-X_vertex)^2 + M_new，其中 X_vertex = I[0]，
 * 且所有圆的总面积等于 A_total。
 * * @param I - 未排序的输入数字数组。I[0] 定义了二次函数的顶点位置 (X_vertex)。
 * @param M - 期望的最小半径 (函数最小值)，M > 0。
 * @param A_total - 所有圆的总面积，A_total > 0。
 * @param a_target - 当面积不足时，算法将使用的目标二次项系数 (a > 0)。
 * @returns 满足约束条件的输出半径数组 O。
 */
function calculate_radii(I: number[], M: number, A_total: number, a_target: number): number[] {
    if (!I || I.length === 0 || A_total <= 0 || M <= 0 || a_target <= 0) {
        return [];
    }

    const N = I.length;
    // X_vertex 是二次函数最低点对应的 X 坐标，它被固定为输入数组的第一个元素 I[0]。
    const X_vertex = I[0]; 
    const S_total = A_total / Math.PI; // 半径平方和 S_total

    // 1. 计算 Dk = (I[k] - X_vertex)^2，以及二次方程系数 P_sum 和 Q_sum
    let P_sum = 0; // P = Sum( (I[k] - X_vertex)^4 )
    let Q_sum = 0; // Q_sum = Sum( (I[k] - X_vertex)^2 )
    
    // 存储 Dk 以便后续计算
    const Dk_array: number[] = [];

    for (const Ik of I) {
        const diff = Ik - X_vertex;
        const Dk = diff * diff; // (I_k - X_vertex)^2
        Dk_array.push(Dk);
        
        P_sum += Dk * Dk; // P = Sum(Dk^2)
        Q_sum += Dk;      // Q_sum = Sum(Dk)
    }

    // --- 失败情况 二：数组单一 (P_sum = 0) 处理 ---
    if (P_sum === 0) {
        // I 数组中所有元素都相等，所以所有 Dk = 0。
        // 目标是让 N * pi * R_new^2 = A_total，即 R_new^2 = S_total / N
        const R_new_squared = S_total / N;
        if (R_new_squared < 0) {
             throw new Error("数学错误：计算得到的半径平方为负数。");
        }
        const R_new = Math.sqrt(R_new_squared);
        return new Array(N).fill(R_new);
    }
    
    // 2. 尝试求解 a (默认情况：满足 M 和 A_total)
    // 方程: P_final*a^2 + Q_final*a + R_final = 0
    const P_final = P_sum;
    const Q_final = 2 * M * Q_sum;
    const R_prime = N * M * M; // a=0 时的最小 S_total (N*M^2)
    const R_final = R_prime - S_total;

    const discriminant = Q_final * Q_final - 4 * P_final * R_final;
    
    let a: number;
    let M_new: number;

    // --- 失败情况 一：面积不足 ($\Delta < 0$) 处理 ---
    if (discriminant < 0) {
        // 忽略原 M 约束，固定 a = a_target，求解 M_new
        a = a_target;

        // 求解 M_new 的二次方程: N*M_new^2 + (2*a*Q_sum)*M_new + (a^2*P_sum - S_total) = 0
        const P_M = N;
        const Q_M = 2 * a * Q_sum;
        const R_M = a * a * P_sum - S_total;

        const disc_M = Q_M * Q_M - 4 * P_M * R_M;

        if (disc_M < 0) {
             throw new Error("约束冲突：固定 a_target 后，无法找到满足总面积的正数最小半径 M_new。");
        }

        const sqrtDisc_M = Math.sqrt(disc_M);
        
        // M_new 必须是正数，我们选择较大的正数解
        M_new = (-Q_M + sqrtDisc_M) / (2 * N);
        
        if (M_new <= 0) {
            // M_new <= 0 表示即使 M=0，固定 a=a_target 产生的面积仍然大于 A_total。
            throw new Error("约束冲突：A_total 过小，无法满足 a_target 和 M_new > 0 的约束。");
        }

    } else { 
        // 3. 正常求解 a ($\Delta \ge 0$)
        const sqrtDiscriminant = Math.sqrt(discriminant);
        
        // 我们只需要 a > 0 的解
        const a1 = (-Q_final + sqrtDiscriminant) / (2 * P_final);
        const a2 = (-Q_final - sqrtDiscriminant) / (2 * P_final);
        
        // 选择 a > 0 的解
        if (a1 > 0) {
            a = a1;
        } else if (a2 > 0) {
            a = a2;
        } else {
            // 正常情况下不会发生，作为安全网
            throw new Error("约束冲突：方程有实数解，但没有 a > 0 的正数开口系数解。");
        }
        
        // 在正常情况下，M_new 就是输入的 M
        M_new = M;
    }

    // 4. 使用求得的 a 和 M_new 计算输出半径数组 O
    const O: number[] = [];
    for (let k = 0; k < N; k++) {
        // O[k] = a * Dk + M_new
        const Ok = a * Dk_array[k] + M_new;
        O.push(Ok);
    }

    return O;
}

export {calculate_radii};