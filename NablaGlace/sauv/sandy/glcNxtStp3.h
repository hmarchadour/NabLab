//#ifndef __BACKEND_glcNxtStp3_H__
#define __BACKEND_glcNxtStp3_H__


// *****************************************************************************
// * Includes
// *****************************************************************************
 // from nabla->simd->includes
#include <sys/time.h>
#include <getopt.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <vector>
#include <math.h>
#include <assert.h>
#include <stdarg.h>
#include <iostream>
#include <sstream>
#include <fstream>
using namespace std;
int omp_get_max_threads(void){return 1;}
int omp_get_thread_num(void){return 0;}
 // from nabla->parallel->includes()


// *****************************************************************************
// * Defines
// *****************************************************************************
#define __host__ 
#define __global__ 
#define WARP_BIT 0
#define WARP_SIZE 1
#define WARP_ALIGN 8
#define NABLA_NB_GLOBAL 1
#define Bool bool
#define Integer int
#define real Real
#define Real2 real3
#define real2 real3
#define rabs(a) fabs(a)
#define set(a) a
#define set1(cst) cst
#define square_root(u) sqrt(u)
#define cube_root(u) cbrt(u)
#define store(u,_u) (*u=_u)
#define load(u) (*u)
#define zero() 0.0
#define DBG_MODE (false)
#define DBG_LVL (DBG_INI_FACE)
#define DBG_OFF 0x0000ul
#define DBG_CELL_VOLUME 0x0001ul
#define DBG_CELL_CQS 0x0002ul
#define DBG_GTH 0x0004ul
#define DBG_NODE_FORCE 0x0008ul
#define DBG_INI_EOS 0x0010ul
#define DBG_EOS 0x0020ul
#define DBG_DENSITY 0x0040ul
#define DBG_MOVE_NODE 0x0080ul
#define DBG_INI 0x0100ul
#define DBG_INI_CELL 0x0200ul
#define DBG_INI_NODE 0x0400ul
#define DBG_INI_FACE 0x0800ul
#define DBG_LOOP 0x100ul
#define DBG_FUNC_IN 0x2000ul
#define DBG_FUNC_OUT 0x4000ul
#define DBG_VELOCITY 0x8000ul
#define DBG_BOUNDARIES 0x10000ul
#define DBG_DUMP false
#define DBG_ALL 0xFFFFFul
#define opAdd(u,v) (u+v)
#define opSub(u,v) (u-v)
#define opDiv(u,v) (u/v)
#define opMul(u,v) (u*v)
#define opMod(u,v) (u%v)
#define opScaMul(u,v) dot3(u,v)
#define opVecMul(u,v) cross(u,v)
#define dot dot3
#define ReduceMinToDouble(a) a
#define ReduceMaxToDouble(a) a
#define knAt(a) 
#define fatal(a,b) exit(-1)
#define mpi_reduce(how,what) how##ToDouble(what)
#define xyz int
#define GlobalIteration global_iteration
#define MD_DirX 0
#define MD_DirY 1
#define MD_DirZ 2
#define MD_Plus 0
#define MD_Negt 4
#define MD_Shift 3
#define MD_Mask 7
#define File std::ofstream&
#define file(name,ext) std::ofstream name(#name "." #ext)
#define xs_node_cell(c) xs_node_cell[n*NABLA_NODE_PER_CELL+c]
#define xs_face_cell(c) xs_face_cell[f+NABLA_NB_FACES*c]
#define xs_face_node(n) xs_face_node[f+NABLA_NB_FACES*n]
#define xs_cell_face(f) xs_cell_face[f+NABLA_NB_CELLS*c]
#define synchronize(v) 


// *****************************************************************************
// * Typedefs
// *****************************************************************************
typedef int integer;
typedef double real;
typedef struct real3 Real3;
typedef struct real3x3 Real3x3;


// *****************************************************************************
// * Forwards
// *****************************************************************************
// no Forwards here!



// *********************************************************
// * Allocation Tweaks
// *********************************************************
//int MPI_Init(int *argc, char ***argv){return 0;}
#if defined(__APPLE__)
	#define aligned_alloc(align,size) calloc(1,size)
#endif

#ifndef _NABLA_LIB_TYPES_H_
#define _NABLA_LIB_TYPES_H_

// ****************************************************************************
// * real3
// ****************************************************************************
struct __attribute__ ((aligned(8))) real3 {
 public:
  __attribute__ ((aligned(8))) double x;
  __attribute__ ((aligned(8))) double y;
  __attribute__ ((aligned(8))) double z;
 public:
  // Constructors
  inline real3(){ x=0.0; y=0.0; z=0.0;}
  inline real3(double d) {x=d; y=d; z=d;}
  inline real3(double _x,double _y,double _z): x(_x), y(_y), z(_z){}
  inline real3(double *_x, double *_y, double *_z){x=*_x; y=*_y; z=*_z;}
  // Arithmetic operators
  friend inline real3 operator+(const real3 &a, const real3& b) {
    return real3((a.x+b.x), (a.y+b.y), (a.z+b.z));}
  friend inline real3 operator-(const real3 &a, const real3& b) {
    return real3((a.x-b.x), (a.y-b.y), (a.z-b.z));}
  friend inline real3 operator*(const real3 &a, const real3& b) {
    return real3((a.x*b.x), (a.y*b.y), (a.z*b.z));}
  friend inline real3 operator/(const real3 &a, const real3& b) {
    return real3((a.x/b.x), (a.y/b.y), (a.z/b.z));}
  // op= operators
  inline real3& operator+=(const real3& b) { return *this=real3((x+b.x),(y+b.y),(z+b.z));}
  inline real3& operator-=(const real3& b) { return *this=real3((x-b.x),(y-b.y),(z-b.z));}
  inline real3& operator*=(const real3& b) { return *this=real3((x*b.x),(y*b.y),(z*b.z));}
  inline real3& operator/=(const real3& b) { return *this=real3((x/b.x),(y/b.y),(z/b.z));}
  inline real3 operator-()const {return real3(0.0-x, 0.0-y, 0.0-z);}
  // op= operators with real
  inline real3& operator+=(double f){return *this=real3(x+f,y+f,z+f);}
  inline real3& operator-=(double f){return *this=real3(x-f,y-f,z-f);}
  inline real3& operator*=(double f){return *this=real3(x*f,y*f,z*f);}
  inline real3& operator/=(double f){return *this=real3(x/f,y/f,z/f);}
  friend inline real dot3(real3 u, real3 v){
    return real(u.x*v.x+u.y*v.y+u.z*v.z);
  }
  friend inline real norm(real3 u){ return square_root(dot3(u,u));}

  friend inline real3 cross(real3 u, real3 v){
    return real3(((u.y*v.z)-(u.z*v.y)), ((u.z*v.x)-(u.x*v.z)), ((u.x*v.y)-(u.y*v.x)));
  }
  inline real abs2(){return x*x+y*y+z*z;}
};

inline real norm(real u){ return ::fabs(u);}

// ****************************************************************************
// * real3x3 
// ****************************************************************************
struct __attribute__ ((aligned(8))) real3x3 {
 public:
  __attribute__ ((aligned(8))) struct real3 x;
  __attribute__ ((aligned(8))) struct real3 y;
  __attribute__ ((aligned(8))) struct real3 z;
  inline real3x3(){ x=0.0; y=0.0; z=0.0;}
  inline real3x3(double d) {x=d; y=d; z=d;}
  inline real3x3(real3 r){ x=r; y=r; z=r;}
  inline real3x3(real3 _x, real3 _y, real3 _z) {x=_x; y=_y; z=_z;}
  // Arithmetic operators
  friend inline real3x3 operator+(const real3x3 &a, const real3x3& b) {
    return real3x3((a.x+b.x), (a.y+b.y), (a.z+b.z));}
  friend inline real3x3 operator-(const real3x3 &a, const real3x3& b) {
    return real3x3((a.x-b.x), (a.y-b.y), (a.z-b.z));}
  friend inline real3x3 operator*(const real3x3 &a, const real3x3& b) {
    return real3x3((a.x*b.x), (a.y*b.y), (a.z*b.z));}
  friend inline real3x3 operator/(const real3x3 &a, const real3x3& b) {
    return real3x3((a.x/b.x), (a.y/b.y), (a.z/b.z));}

  inline real3x3& operator+=(const real3x3& b) { return *this=real3x3((x+b.x),(y+b.y),(z+b.z));}
  inline real3x3& operator-=(const real3x3& b) { return *this=real3x3((x-b.x),(y-b.y),(z-b.z));}
  inline real3x3& operator*=(const real3x3& b) { return *this=real3x3((x*b.x),(y*b.y),(z*b.z));}
  inline real3x3& operator/=(const real3x3& b) { return *this=real3x3((x/b.x),(y/b.y),(z/b.z));}
  inline real3x3 operator-()const {return real3x3(0.0-x, 0.0-y, 0.0-z);}

  inline real3x3& operator*=(const real& d) { return *this=real3x3(x*d,y*d,z*d);}
  inline real3x3& operator/=(const real& d) { return *this=real3x3(x/d,y/d,z/d);}
  
  friend inline real3x3 operator*(real3x3 t, double d) { return real3x3(t.x*d,t.y*d,t.z*d);}
  
  friend inline real3 opProdTensVec(real3x3 t,real3 v){
    return real3(dot3(t.x,v),dot3(t.y,v),dot3(t.z,v));
  }
};
inline real3x3 opProdTens(real3 a,real3 b){
  return real3x3(a.x*b,a.y*b,a.z*b);
}
inline real matrixDeterminant(real3x3 m) {
  return (  m.x.x*(m.y.y*m.z.z-m.y.z*m.z.y)
          + m.x.y*(m.y.z*m.z.x-m.y.x*m.z.z)
          + m.x.z*(m.y.x*m.z.y-m.y.y*m.z.x));
}
inline real3x3 inverseMatrix(real3x3 m,real d){
  Real3x3 inv(real3(m.y.y*m.z.z-m.y.z*m.z.y,
                    -m.x.y*m.z.z+m.x.z*m.z.y,
                    m.x.y*m.y.z-m.x.z*m.y.y),
              real3(m.z.x*m.y.z-m.y.x*m.z.z,
                    -m.z.x*m.x.z+m.x.x*m.z.z,
                    m.y.x*m.x.z-m.x.x*m.y.z),
              real3(-m.z.x*m.y.y+m.y.x*m.z.y,
                    m.z.x*m.x.y-m.x.x*m.z.y,
                    -m.y.x*m.x.y+m.x.x*m.y.y));
  inv/=d;
  return inv;
}
inline real3x3 matrix3x3Id(){
  return real3x3(real3(1.0, 0.0, 0.0),
                 real3(0.0, 1.0, 0.0),
                 real3(0.0, 0.0, 1.0));
}
inline real3x3 opMatrixProduct(const real3x3 &t1,
                               const real3x3 &t2) {
  real3x3 temp;
  temp.x.x = t1.x.x*t2.x.x+t1.x.y*t2.y.x+t1.x.z*t2.z.x;
  temp.y.x = t1.y.x*t2.x.x+t1.y.y*t2.y.x+t1.y.z*t2.z.x;
  temp.z.x = t1.z.x*t2.x.x+t1.z.y*t2.y.x+t1.z.z*t2.z.x;
  temp.x.y = t1.x.x*t2.x.y+t1.x.y*t2.y.y+t1.x.z*t2.z.y;
  temp.y.y = t1.y.x*t2.x.y+t1.y.y*t2.y.y+t1.y.z*t2.z.y;
  temp.z.y = t1.z.x*t2.x.y+t1.z.y*t2.y.y+t1.z.z*t2.z.y;
  temp.x.z = t1.x.x*t2.x.z+t1.x.y*t2.y.z+t1.x.z*t2.z.z;
  temp.y.z = t1.y.x*t2.x.z+t1.y.y*t2.y.z+t1.y.z*t2.z.z;
  temp.z.z = t1.z.x*t2.x.z+t1.z.y*t2.y.z+t1.z.z*t2.z.z;
  return temp;
}

#endif //  _NABLA_LIB_TYPES_H_
#ifndef _NABLA_LIB_TERNARY_H_
#define _NABLA_LIB_TERNARY_H_

inline int opTernary(const bool cond,
                     const int ifStatement,
                     const int elseStatement){
  if (cond) return ifStatement;
  return elseStatement;
}

inline real opTernary(const bool cond,
                      const real ifStatement,
                      const real elseStatement){
  if (cond) return ifStatement;
  return elseStatement;
}

inline real3 opTernary(const bool cond,
                       const real3& ifStatement,
                       const double elseStatement){
  if (cond) return ifStatement;
  return real3(elseStatement);
}


inline real3 opTernary(const bool cond,
                       const double ifStatement,
                       const real3&  elseStatement){
  if (cond) return Real3(ifStatement);
  return elseStatement;
}

#endif //  _NABLA_LIB_TERNARY_H_
#ifndef _NABLA_LIB_SCATTER_H_
#define _NABLA_LIB_SCATTER_H_

// *****************************************************************************
// * Scatter: (X is the data @ offset x)
// * scatter: |ABCD| and offsets:    a                 b       c   d
// * data:    |....|....|....|....|..A.|....|....|....|B...|...C|..D.|....|....|
// * ! à la séquence car quand c et d sont sur le même warp, ça percute
// ******************************************************************************
inline void scatterk(const int a, real *gathered, real *data){
  if (a<0) return; // Skipping to fake write
  data[a]=*gathered;
}

inline void scatter3k(const int a, real3 *gathered, real3 *data){
  if (a<0) return; // Skipping to fake write
  double *p=(double *)data;
  p[3*a+0]=gathered->x;
  p[3*a+1]=gathered->y;
  p[3*a+2]=gathered->z;
}

inline void scatter3x3k(const int a, real3x3 *gathered, real3x3 *data){
  if (a<0) return; // Skipping to fake write
  data[a]=*gathered;
}

#endif //  _NABLA_LIB_SCATTER_H_
#ifndef _NABLA_OSTREAM_H_
#define _NABLA_OSTREAM_H_

std::ostream& info(){
  std::cout.flush();
  std::cout<<"\n";
  return std::cout;
}

// Get rid of this last global variable
std::ofstream devNull("/dev/null");

std::ostream& debug(){
  if (getenv("NABLA_LAMBDA_ALEPH_DEBUG")==NULL) return devNull;//std::clog;
  std::cout.flush();
  std::cout<<"\n";
  return std::cout;
}

std::ostream& operator<<(std::ostream &os, const Real3 &a){
  double *x = (double*)&(a.x);
  double *y = (double*)&(a.y);
  double *z = (double*)&(a.z);
  return os << "("<<*x<<","<<*y<<","<<*z<< ")";
}

std::ostream& operator<<(std::ostream &os, const Real3x3 &a){
  return os << "(" << a.x <<","<< a.y <<","<< a.z <<")";
}

#endif // _NABLA_OSTREAM_H_
#ifndef _NABLA_LIB_DBG_HPP_
#define _NABLA_LIB_DBG_HPP_

#include <stdarg.h>

// ****************************************************************************
// * Outils de traces
// ****************************************************************************
void dbg(const unsigned int flag, const char *format, ...){
  if (!DBG_MODE) return;
  if ((flag&DBG_LVL)==0) return;
  va_list args;
  va_start(args, format);
  vprintf(format, args);
  fflush(stdout);
  va_end(args);
}

#define dbgFuncIn()  do{dbg(DBG_FUNC_IN,"\n\t > %s",__FUNCTION__);}while(0)
#define dbgFuncOut() do{dbg(DBG_FUNC_OUT,"\n\t\t < %s",__FUNCTION__);}while(0)

inline void dbgReal3(const unsigned int flag, real3& v){
  if (!DBG_MODE) return;
  if ((flag&DBG_LVL)==0) return;
  double x[1];
  double y[1];
  double z[1];
  store(x, v.x);
  store(y, v.y);
  store(z, v.z);
  printf("\n\t\t\t[%.14f,%.14f,%.14f]", x[0], y[0], z[0]);
  fflush(stdout);
}

inline void dbgReal(const unsigned int flag, real v){
  if (!DBG_MODE) return;
  if ((flag&DBG_LVL)==0) return;
  double x[1];
  store(x, v);
  printf("[");
  printf("%.14f ", x[0]);
  printf("]");
  fflush(stdout);
}

#endif // _NABLA_LIB_DBG_HPP_

static inline Real3 perp(Real3 greek_alpha , Real3 greek_beta );
static inline Real trace(Real3x3 M );